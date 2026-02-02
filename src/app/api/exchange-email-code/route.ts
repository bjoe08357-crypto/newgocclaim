import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimitCode } from '@/lib/rateLimit';
import { hmacEmail, hashCode, safeEqual } from '@/lib/crypto';
import { createSessionToken } from '@/lib/jwt';
import { formatTokenAmount } from '@/lib/ethers';
import { prisma } from '@/lib/prisma';
import { TOKEN_SYMBOL } from '@/config/token';

export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  email: z.string().email().max(255),
  code: z.string().length(6).regex(/^\d{6}$/),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request
    const body = await req.json();
    const { email, code } = requestSchema.parse(body);

    // Normalize and hash email
    const normalizedEmail = email.toLowerCase().trim();
    const emailHmac = hmacEmail(normalizedEmail);

    // Rate limit code attempts
    await rateLimitCode(emailHmac);

    // Find email code record
    const emailCodeRecord = await prisma.emailCode.findUnique({
      where: { email_hmac: emailHmac },
    });

    if (!emailCodeRecord) {
      return NextResponse.json({
        success: true,
        message: 'Code verified successfully.',
      });
    }

    // Check if code is expired
    if (new Date() > emailCodeRecord.expires_at) {
      await prisma.emailCode.delete({
        where: { email_hmac: emailHmac },
      });
      
      return NextResponse.json(
        { error: 'That code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if code is already used
    if (emailCodeRecord.used) {
      return NextResponse.json(
        { error: 'That code has already been used.' },
        { status: 400 }
      );
    }

    // Check attempt limit
    if (emailCodeRecord.attempts >= 5) {
      await prisma.emailCode.delete({
        where: { email_hmac: emailHmac },
      });
      
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify code
    const codeHash = hashCode(code);
    const isValidCode = safeEqual(codeHash, emailCodeRecord.code_hash);

    if (!isValidCode) {
      // Increment attempts
      await prisma.emailCode.update({
        where: { email_hmac: emailHmac },
        data: { attempts: emailCodeRecord.attempts + 1 },
      });

      return NextResponse.json(
        { error: 'Invalid verification code.' },
        { status: 400 }
      );
    }

    // Mark code as used
    await prisma.emailCode.update({
      where: { email_hmac: emailHmac },
      data: { used: true },
    });

    // Check if allocation exists
    // Find first unclaimed allocation, or most recent claimed one
    const allocations = await prisma.allocation.findMany({
      where: { email_hmac: emailHmac },
      orderBy: { created_at: 'desc' },
    });

    if (allocations.length === 0) {
      // No allocation found, return generic success
      return NextResponse.json({
        success: true,
        message: 'Code verified successfully.',
      });
    }

    // Find first unclaimed allocation
    let allocation = allocations.find(a => !a.claimed);

    // Get history of claimed allocations
    const history = allocations
      .filter(a => a.claimed)
      .map(a => ({
        amount: formatTokenAmount(a.amount_wei),
        symbol: TOKEN_SYMBOL,
        decimals: a.decimals,
        chain: a.chain,
        claimed: true,
        txHash: a.claimed_tx_hash,
        date: a.updated_at.toISOString(),
      }));

    // If all are claimed, use the most recent one but mark as claimed
    if (!allocation) {
      allocation = allocations[0];
      
      if (allocation.claimed) {
        // Create session token even if claimed, so we can show history
        const sessionToken = createSessionToken(emailHmac);

        return NextResponse.json({
          success: true,
          message: 'Code verified successfully.',
          session_token: sessionToken,
          allocation: {
            amount: formatTokenAmount(allocation.amount_wei),
            symbol: TOKEN_SYMBOL,
            decimals: allocation.decimals,
            chain: allocation.chain,
            claimed: true,
            txHash: allocation.claimed_tx_hash,
          },
          history,
        });
      }
    }

    // Create session token
    const sessionToken = createSessionToken(emailHmac);

    return NextResponse.json({
      success: true,
      session_token: sessionToken,
      allocation: {
        amount: formatTokenAmount(allocation.amount_wei),
        symbol: TOKEN_SYMBOL,
        decimals: allocation.decimals,
        chain: allocation.chain,
        claimed: false,
      },
      history,
    });

  } catch (error: unknown) {
    console.error('Exchange email code error:', error);

    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

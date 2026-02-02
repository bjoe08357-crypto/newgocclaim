import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimitByIP, rateLimitEmail } from '@/lib/rateLimit';
// import { verifyTurnstileToken } from '@/lib/turnstile'; // Removed captcha
import { hmacEmail, hashCode } from '@/lib/crypto';
import { generateEmailCode, sendVerificationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  email: z.string().email().max(255),
  // turnstileToken: z.string().min(1), // Removed captcha requirement
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    await rateLimitByIP(req);

    // Parse and validate request
    const body = await req.json();
    const { email } = requestSchema.parse(body);

    // Captcha verification removed for easier testing

    // Normalize and hash email
    const normalizedEmail = email.toLowerCase().trim();
    const emailHmac = hmacEmail(normalizedEmail);

    // Rate limit by email
    await rateLimitEmail(emailHmac);

    // Generate verification code
    const code = generateEmailCode();
    const codeHash = hashCode(code);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store or update code in database
    await prisma.emailCode.upsert({
      where: { email_hmac: emailHmac },
      update: {
        code_hash: codeHash,
        expires_at: expiresAt,
        attempts: 0,
        used: false,
      },
      create: {
        email_hmac: emailHmac,
        code_hash: codeHash,
        expires_at: expiresAt,
        attempts: 0,
        used: false,
      },
    });

    // Send email (always send, don't leak existence)
    try {
      await sendVerificationEmail(normalizedEmail, code);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't fail the request if email fails
    }

    // Always return success (don't leak allocation existence)
    return NextResponse.json({
      success: true,
      message: 'If an allocation exists for this email, we\'ve sent a verification code.',
    });

  } catch (error: unknown) {
    console.error('Request email code error:', error);

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

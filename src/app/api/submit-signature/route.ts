import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySessionToken, extractBearerToken } from '@/lib/jwt';
import { verifySiweSignature } from '@/lib/siwe';
import { isValidAddress } from '@/lib/ethers';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    // Verify session token
    const authHeader = req.headers.get('authorization');
    const token = extractBearerToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await req.json();
    const { address, signature, message } = requestSchema.parse(body);

    // Validate address format
    if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Get stored nonce
    const nonceRecord = await prisma.siweNonce.findUnique({
      where: { email_hmac: session.sub },
    });

    if (!nonceRecord) {
      return NextResponse.json(
        { error: 'No nonce found. Please request a new challenge.' },
        { status: 400 }
      );
    }

    if (nonceRecord.consumed) {
      return NextResponse.json(
        { error: 'Nonce already used. Please request a new challenge.' },
        { status: 400 }
      );
    }

    // Check nonce expiration (15 minutes)
    const nonceAge = Date.now() - nonceRecord.issued_at.getTime();
    if (nonceAge > 15 * 60 * 1000) {
      await prisma.siweNonce.delete({
        where: { email_hmac: session.sub },
      });
      
      return NextResponse.json(
        { error: 'Nonce expired. Please request a new challenge.' },
        { status: 400 }
      );
    }

    // Verify SIWE signature
    const verificationResult = await verifySiweSignature(
      message,
      signature,
      address,
      nonceRecord.nonce
    );

    if (!verificationResult.valid) {
      return NextResponse.json(
        { error: verificationResult.error || 'Invalid signature' },
        { status: 400 }
      );
    }

    // Mark nonce as consumed
    await prisma.siweNonce.update({
      where: { email_hmac: session.sub },
      data: { consumed: true },
    });

    // Check if binding already exists
    const existingBinding = await prisma.binding.findUnique({
      where: { email_hmac: session.sub },
    });

    if (existingBinding) {
      // Allow updating wallet address (re-binding)
      // This supports users who want to change their wallet for future claims
      if (existingBinding.wallet_address.toLowerCase() !== address.toLowerCase()) {
        await prisma.binding.update({
          where: { email_hmac: session.sub },
          data: {
            wallet_address: address.toLowerCase(),
            updated_at: new Date()
          },
        });
      } else {
        // Just update timestamp
        await prisma.binding.update({
          where: { email_hmac: session.sub },
          data: { updated_at: new Date() },
        });
      }
    } else {
      // Create new binding
      await prisma.binding.create({
        data: {
          email_hmac: session.sub,
          wallet_address: address.toLowerCase(),
        },
      });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: unknown) {
    console.error('Submit signature error:', error);

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

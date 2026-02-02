import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySessionToken, extractBearerToken } from '@/lib/jwt';
import { generateNonce, createSiweMessageString } from '@/lib/siwe';
import { isValidAddress } from '@/lib/ethers';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
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
    const { address } = requestSchema.parse(body);

    // Validate address format
    if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Generate nonce
    const nonce = generateNonce();

    // Store nonce in database
    await prisma.siweNonce.upsert({
      where: { email_hmac: session.sub },
      update: {
        nonce,
        issued_at: new Date(),
        consumed: false,
      },
      create: {
        email_hmac: session.sub,
        nonce,
        issued_at: new Date(),
        consumed: false,
      },
    });

    // Create SIWE message
    const message = createSiweMessageString(address, nonce, 1); // Ethereum mainnet

    return NextResponse.json({
      message,
      nonce,
    });

  } catch (error: unknown) {
    console.error('Get sign challenge error:', error);

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

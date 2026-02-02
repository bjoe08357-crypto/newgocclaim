import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, extractBearerToken } from '@/lib/jwt';
import { formatTokenAmount } from '@/lib/ethers';
import { prisma } from '@/lib/prisma';
import { TOKEN_SYMBOL } from '@/config/token';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
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

    const emailHmac = session.sub;

    // Check if allocation exists
    const allocations = await prisma.allocation.findMany({
      where: { email_hmac: emailHmac },
      orderBy: { created_at: 'desc' },
    });

    if (allocations.length === 0) {
      return NextResponse.json(
        { error: 'No allocation found' },
        { status: 404 }
      );
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

    // If all are claimed, use the most recent one
    if (!allocation) {
      allocation = allocations[0];
      
      if (allocation.claimed) {
        return NextResponse.json({
          success: true,
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

    return NextResponse.json({
      success: true,
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
    console.error('Claim status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
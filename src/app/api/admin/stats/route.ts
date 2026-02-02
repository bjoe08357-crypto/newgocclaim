import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const credentials = Buffer.from(authHeader.substring(6), 'base64').toString();
  const [username, password] = credentials.split(':');

  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get basic statistics from database
    let totalAllocations = 0;
    let claimedAllocations = 0;
    let totalValue = 0;
    let claimedValue = 0;

    try {
      totalAllocations = await prisma.allocation.count();
      claimedAllocations = await prisma.allocation.count({
        where: { claimed: true }
      });
      
      // Calculate actual token values from database
      // Since amount_wei is stored as String, we need to fetch and sum manually
      const allAllocations = await prisma.allocation.findMany({
        select: {
          amount_wei: true,
          claimed: true
        }
      });
      
      // Convert from wei to tokens and sum
      const TOKEN_DECIMALS = parseInt(process.env.TOKEN_DECIMALS || '18');
      const divisor = BigInt(10 ** TOKEN_DECIMALS);
      
      let totalValueWei = BigInt(0);
      let claimedValueWei = BigInt(0);
      
      for (const allocation of allAllocations) {
        const amountWei = BigInt(allocation.amount_wei);
        totalValueWei += amountWei;
        
        if (allocation.claimed) {
          claimedValueWei += amountWei;
        }
      }
      
      totalValue = parseFloat((totalValueWei / divisor).toString());
      claimedValue = parseFloat((claimedValueWei / divisor).toString());
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return mock data if database fails
      totalAllocations = 0;
      claimedAllocations = 0;
      totalValue = 0;
      claimedValue = 0;
    }

    const pendingClaims = totalAllocations - claimedAllocations;

    return NextResponse.json({
      totalAllocations,
      claimedAllocations,
      pendingClaims,
      totalValue,
      claimedValue,
      claimPercentage: totalAllocations > 0 ? Math.round((claimedAllocations / totalAllocations) * 100) : 0
    });

  } catch (error: unknown) {
    console.error('Admin stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch statistics: ${errorMessage}` },
      { status: 500 }
    );
  }
}

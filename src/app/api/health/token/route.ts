import { NextResponse } from 'next/server';
import { checkTokenHealth } from '@/lib/ethers';

export async function GET() {
  try {
    const health = await checkTokenHealth();
    
    if (health.ok) {
      return NextResponse.json({
        ok: true,
        symbol: health.symbol,
        decimals: health.decimals,
        contract: health.contract,
      });
    } else {
      return NextResponse.json({
        ok: false,
        reason: health.reason,
      }, { status: 500 });
    }
  } catch (error: unknown) {
    return NextResponse.json({
      ok: false,
      reason: `Health check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }, { status: 500 });
  }
}

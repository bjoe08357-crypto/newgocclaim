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

    // Get gas settings from database
    try {
      const settings = await prisma.gasSettings.findUnique({
        where: { id: 'default' }
      });
      
      if (settings) {
        return NextResponse.json({
          maxGasLimit: settings.max_gas_limit,
          maxGasCostETH: settings.max_gas_cost_eth,
        });
      }
    } catch (error) {
      console.warn('Could not read gas settings from database:', error);
    }

    // Fallback to environment variables
    return NextResponse.json({
      maxGasLimit: process.env.MAX_GAS_LIMIT || '100000',
      maxGasCostETH: process.env.MAX_GAS_COST_ETH || '0.0025',
    });

  } catch (error: unknown) {
    console.error('Gas settings GET error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch gas settings: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { maxGasLimit, maxGasCostETH } = body;

    // Validate inputs
    if (!maxGasLimit || !maxGasCostETH) {
      return NextResponse.json(
        { error: 'Missing required fields: maxGasLimit, maxGasCostETH' },
        { status: 400 }
      );
    }

    // Validate ranges
    const gasLimit = parseInt(maxGasLimit);
    const gasCost = parseFloat(maxGasCostETH);

    if (gasLimit < 21000 || gasLimit > 200000) {
      return NextResponse.json(
        { error: 'Gas limit must be between 21,000 and 200,000' },
        { status: 400 }
      );
    }

    if (gasCost < 0.0001 || gasCost > 0.01) {
      return NextResponse.json(
        { error: 'Gas cost must be between 0.0001 and 0.01 ETH' },
        { status: 400 }
      );
    }

    // Update gas settings in database (works in serverless)
    await prisma.gasSettings.upsert({
      where: { id: 'default' },
      update: {
        max_gas_limit: maxGasLimit.toString(),
        max_gas_cost_eth: maxGasCostETH.toString(),
        updated_by: 'admin', // Could get from auth header
      },
      create: {
        id: 'default',
        max_gas_limit: maxGasLimit.toString(),
        max_gas_cost_eth: maxGasCostETH.toString(),
        updated_by: 'admin',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Gas settings updated successfully',
      settings: {
        maxGasLimit,
        maxGasCostETH,
      },
    });

  } catch (error: unknown) {
    console.error('Gas settings POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to update gas settings: ${errorMessage}` },
      { status: 500 }
    );
  }
}

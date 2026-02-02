import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { verifySessionToken, extractBearerToken } from '@/lib/jwt';
import { checkTokenHealth, executeTransfer, formatTokenAmount, checkSufficientBalance } from '@/lib/ethers';
import { sendClaimReceiptEmail } from '@/lib/email';
import { decryptPII } from '@/lib/crypto';
import { prisma } from '@/lib/prisma';
import { TOKEN_SYMBOL } from '@/config/token';

export const dynamic = 'force-dynamic';

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

    // Get recipient address from request body
    const { recipientAddress } = await req.json();

    if (!recipientAddress) {
      return NextResponse.json(
        { error: 'Recipient address is required' },
        { status: 400 }
      );
    }

    // Validate recipient address format
    if (!ethers.isAddress(recipientAddress)) {
      return NextResponse.json(
        { error: 'Invalid recipient address format' },
        { status: 400 }
      );
    }

    // Check token health
    const tokenHealth = await checkTokenHealth();
    if (!tokenHealth.ok) {
      return NextResponse.json(
        { error: 'Token claiming is currently unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Load allocation - find the first unclaimed one, or the most recently claimed one if all are claimed
    // We prioritize unclaimed allocations
    const allocations = await prisma.allocation.findMany({
      where: { email_hmac: session.sub },
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

    // If all are claimed, use the most recent one (idempotent behavior)
    if (!allocation) {
      allocation = allocations[0];
      
      if (allocation.claimed && allocation.claimed_tx_hash) {
        return NextResponse.json({
          success: true,
          txHash: allocation.claimed_tx_hash,
          message: 'This allocation was already claimed.',
        });
      }
    }

    // No wallet binding required for simplified flow - recipient address provided directly

    // Check distributor balance
    const balanceCheck = await checkSufficientBalance(allocation.amount_wei);
    if (!balanceCheck.sufficient) {
      console.error('Insufficient distributor balance:', balanceCheck);
      
      // More specific error message
      const tokenShortage = parseFloat(balanceCheck.tokenBalance) < parseFloat(balanceCheck.requiredToken);
      const ethShortage = parseFloat(balanceCheck.ethBalance) < parseFloat(balanceCheck.estimatedGasCost);
      
      let errorDetail = '';
      if (tokenShortage && ethShortage) {
        errorDetail = ` (Distributor needs ${balanceCheck.requiredToken} ${TOKEN_SYMBOL} and ${balanceCheck.estimatedGasCost} ETH, but has ${balanceCheck.tokenBalance} ${TOKEN_SYMBOL} and ${balanceCheck.ethBalance} ETH)`;
      } else if (tokenShortage) {
        errorDetail = ` (Distributor needs ${balanceCheck.requiredToken} ${TOKEN_SYMBOL} but only has ${balanceCheck.tokenBalance} ${TOKEN_SYMBOL})`;
      } else if (ethShortage) {
        errorDetail = ` (Distributor needs ${balanceCheck.estimatedGasCost} ETH for gas but only has ${balanceCheck.ethBalance} ETH)`;
      }
      
      // User-friendly error message for production
      const userMessage = 'Token claiming is temporarily unavailable due to high network gas fees. Please try again in a few minutes when network congestion is lower.';
      
      // Log technical details for debugging
      console.error(`Distributor insufficient funds${errorDetail}`);
      
      return NextResponse.json(
        { error: userMessage },
        { status: 503 }
      );
    }

    // Execute transfer
    const transferResult = await executeTransfer(
      recipientAddress,
      allocation.amount_wei
    );

    // Update allocation as claimed
    await prisma.allocation.update({
      where: { id: allocation.id },
      data: {
        claimed: true,
        claimed_tx_hash: transferResult.txHash,
        updated_at: new Date(),
      },
    });

    // Send receipt email (best effort)
    try {
      const emailLookup = await prisma.emailLookup.findUnique({
        where: { email_hmac: session.sub },
      });

      if (emailLookup) {
        const email = decryptPII(emailLookup.email_encrypted);
        const amount = formatTokenAmount(allocation.amount_wei);
        
        await sendClaimReceiptEmail(
          email,
          amount,
          transferResult.txHash,
          recipientAddress
        );
      }
    } catch (error) {
      console.error('Failed to send receipt email:', error);
      // Don't fail the claim if email fails
    }

    return NextResponse.json({
      success: true,
      txHash: transferResult.txHash,
    });

  } catch (error: unknown) {
    console.error('Claim error:', error);

    // If it's a blockchain error, provide more specific feedback
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds') || error.message.includes('INSUFFICIENT_FUNDS')) {
        return NextResponse.json(
          { error: 'Token claiming is temporarily unavailable due to network congestion. Please try again in a few minutes.' },
          { status: 503 }
        );
      }

      if (error.message.includes('gas') || error.message.includes('Gas fee too high')) {
        return NextResponse.json(
          { error: 'Token claiming is temporarily unavailable due to high network gas fees. Please try again when network congestion is lower.' },
          { status: 503 }
        );
      }
    }

    if (error instanceof Error && error.message.includes('nonce')) {
      return NextResponse.json(
        { error: 'Transaction failed due to network congestion. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Claim failed. Please try again later.' },
      { status: 500 }
    );
  }
}

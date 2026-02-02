import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hmacEmail, encryptPII } from '@/lib/crypto';

export const dynamic = 'force-dynamic';
import { parseTokenAmount } from '@/lib/ethers';
import { prisma } from '@/lib/prisma';
import { TOKEN_ADDRESS } from '@/config/token';

// Basic auth middleware
function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const credentials = Buffer.from(authHeader.substring(6), 'base64').toString();
  const [username, password] = credentials.split(':');

  // Debug logging (remove in production if sensitive)
  console.log('Auth attempt:', { 
    providedUser: username, 
    expectedUser: process.env.ADMIN_USERNAME,
    match: username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD 
  });

  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

const uploadSchema = z.object({
  csvData: z.string().min(1),
});

interface CsvRow {
  email: string;
  amount: string;
}

function parseCsvData(csvData: string): CsvRow[] {
  const lines = csvData.trim().split('\n');
  const rows: CsvRow[] = [];

  // Skip header if present
  const startIndex = lines[0].toLowerCase().includes('email') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [email, amount] = line.split(',').map(s => s.trim().replace(/"/g, ''));
    
    if (!email || !amount) {
      throw new Error(`Invalid CSV format at line ${i + 1}: ${line}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format at line ${i + 1}: ${email}`);
    }

    // Validate amount format
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error(`Invalid amount at line ${i + 1}: ${amount}`);
    }

    rows.push({ email: email.toLowerCase().trim(), amount });
  }

  return rows;
}

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'WWW-Authenticate': 'Basic' } }
      );
    }

    // Parse request
    const body = await req.json();
    const { csvData } = uploadSchema.parse(body);

    // Parse CSV data
    const rows = parseCsvData(csvData);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No valid rows found in CSV' },
        { status: 400 }
      );
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    // Process each row
    for (const row of rows) {
      try {
        const emailHmac = hmacEmail(row.email);
        const amountWei = parseTokenAmount(row.amount);
        const encryptedEmail = encryptPII(row.email);

        // Check if there is an existing unclaimed allocation
        const existingUnclaimed = await prisma.allocation.findFirst({
          where: {
            email_hmac: emailHmac,
            claimed: false
          },
        });

        if (existingUnclaimed) {
          // Accumulate balance
          const currentAmount = BigInt(existingUnclaimed.amount_wei);
          const newAmount = BigInt(amountWei);
          const totalAmount = (currentAmount + newAmount).toString();

          console.log(`Accumulating balance for ${row.email}: ${currentAmount} + ${newAmount} = ${totalAmount}`);

          // Update existing unclaimed allocation
          await prisma.allocation.update({
            where: { id: existingUnclaimed.id },
            data: {
              amount_wei: totalAmount,
              updated_at: new Date(),
            },
          });

          // Update email lookup
          await prisma.emailLookup.upsert({
            where: { email_hmac: emailHmac },
            update: { email_encrypted: encryptedEmail },
            create: {
              email_hmac: emailHmac,
              email_encrypted: encryptedEmail,
            },
          });

          updated++;
        } else {
          // Create new allocation (either first time, or previous ones were claimed)
          console.log(`Creating new allocation for ${row.email}: ${amountWei}`);
          await prisma.allocation.create({
            data: {
              email_hmac: emailHmac,
              amount_wei: amountWei,
              decimals: 18,
              token_contract: TOKEN_ADDRESS,
              chain: 'ethereum',
            },
          });

          // Create email lookup
          // Use upsert to handle potential race conditions or existing records
          await prisma.emailLookup.upsert({
            where: { email_hmac: emailHmac },
            update: { email_encrypted: encryptedEmail },
            create: {
              email_hmac: emailHmac,
              email_encrypted: encryptedEmail,
            },
          });

          inserted++;
        }
      } catch (error: unknown) {
        console.error(`Error processing row ${row.email}:`, error);
        skipped++;
      }
    }

    // Log admin action
    await prisma.auditLog.create({
      data: {
        action: 'csv_upload',
        details: {
          total_rows: rows.length,
          inserted,
          updated,
          skipped,
        },
        admin_user: 'admin', // Could be enhanced with proper user tracking
      },
    });

    return NextResponse.json({
      success: true,
      inserted,
      updated,
      skipped,
      total: rows.length,
    });

  } catch (error: unknown) {
    console.error('CSV upload error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    if (error instanceof Error && (error.message.includes('Invalid CSV format') || error.message.includes('Invalid email') || error.message.includes('Invalid amount'))) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

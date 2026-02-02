import nodemailer from 'nodemailer';
import { generateSecureCode } from './crypto';

const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = parseInt((process.env.SMTP_PORT || '587').trim(), 10);
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASS = process.env.SMTP_PASS?.trim();
const EMAIL_FROM = process.env.EMAIL_FROM?.trim() || 'claims@goc.example';
const EMAIL_ENABLED = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

if (!EMAIL_ENABLED) {
  console.warn('Email configuration missing. Email sending will be disabled.');
}

// Create transporter
const transporter = EMAIL_ENABLED
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

/**
 * Generate a 6-digit verification code
 */
export function generateEmailCode(): string {
  return generateSecureCode(6);
}

/**
 * Send verification code email
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<void> {
  if (!EMAIL_ENABLED || !transporter) {
    console.warn(`[DEV] Email code for ${email}: ${code}`);
    return;
  }

  const subject = 'Your GOC Claim Verification Code';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GOC Claim Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">GOC Claim Portal</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Secure Token Claiming</p>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
        
        <p>Hello,</p>
        
        <p>You've requested to claim GOC tokens. Please use the verification code below to continue:</p>
        
        <div style="background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #495057; letter-spacing: 4px; font-family: 'Courier New', monospace;">${code}</span>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Important:</strong>
          <br>• This code expires in 15 minutes
          <br>• Use it only on the official GOC claim portal
          <br>• Never share this code with anyone
        </p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>Security Notice:</strong> If you didn't request this code, please ignore this email. No further action is required.
          </p>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Best regards,<br>
          The GOC Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© 2025 GOC. All rights reserved.</p>
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
GOC Claim Portal - Verification Code

Your verification code: ${code}

This code expires in 15 minutes. Use it only on the official GOC claim portal.

If you didn't request this code, please ignore this email.

Best regards,
The GOC Team
  `.trim();

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send claim receipt email
 */
export async function sendClaimReceiptEmail(
  email: string,
  amount: string,
  txHash: string,
  walletAddress: string
): Promise<void> {
  if (!EMAIL_ENABLED || !transporter) {
    console.warn(`[DEV] Claim receipt for ${email}: ${amount} GOC, TX: ${txHash}`);
    return;
  }

  const etherscanUrl = `https://etherscan.io/tx/${txHash}`;
  const subject = '🎉 Your GOC Claim is Complete!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GOC Claim Complete</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Claim Successful!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your GOC tokens have been sent</p>
      </div>
      
      <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Claim Details</h2>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Amount:</strong> ${amount} GOC</p>
          <p style="margin: 0 0 10px 0;"><strong>Wallet:</strong> ${walletAddress}</p>
          <p style="margin: 0;"><strong>Transaction:</strong> <a href="${etherscanUrl}" style="color: #059669; text-decoration: none;">${txHash}</a></p>
        </div>
        
        <p>Congratulations! Your GOC tokens have been successfully transferred to your wallet.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${etherscanUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View on Etherscan</a>
        </div>
        
        <div style="background: #f3f4f6; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #374151; font-size: 14px;">
            <strong>What's next?</strong>
            <br>• Your tokens should appear in your wallet shortly
            <br>• You can view the transaction on Etherscan using the link above
            <br>• This was a one-time claim - no further action is needed
          </p>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Thank you for being part of the GOC community!<br>
          The GOC Team
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© 2025 GOC. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
🎉 Your GOC Claim is Complete!

Claim Details:
- Amount: ${amount} GOC
- Wallet: ${walletAddress}
- Transaction: ${txHash}

View on Etherscan: ${etherscanUrl}

Your tokens should appear in your wallet shortly. This was a one-time claim.

Thank you for being part of the GOC community!
The GOC Team
  `.trim();

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

import { createHmac, randomBytes, createCipheriv, createDecipheriv, timingSafeEqual } from 'crypto';

const PEPPER = process.env.PEPPER;
if (!PEPPER) {
  throw new Error('PEPPER environment variable is required');
}

// Type assertion since we've checked it exists
const PEPPER_KEY = PEPPER as string;

/**
 * Generate HMAC of email for consistent hashing
 */
export function hmacEmail(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  return createHmac('sha256', PEPPER_KEY)
    .update(normalizedEmail)
    .digest('hex');
}

/**
 * Timing-safe string comparison
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Encrypt PII data (like raw emails)
 */
export function encryptPII(data: string): string {
  const key = Buffer.from(PEPPER_KEY.slice(0, 32), 'utf8');
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Prepend IV to encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt PII data
 */
export function decryptPII(encryptedData: string): string {
  const key = Buffer.from(PEPPER_KEY.slice(0, 32), 'utf8');
  const [ivHex, encrypted] = encryptedData.split(':');
  
  if (!ivHex || !encrypted) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate a secure random code
 */
export function generateSecureCode(length: number = 6): string {
  const digits = '0123456789';
  let result = '';
  const bytes = randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += digits[bytes[i] % digits.length];
  }
  
  return result;
}

/**
 * Hash a code for storage
 */
export function hashCode(code: string): string {
  return createHmac('sha256', PEPPER_KEY)
    .update(code)
    .digest('hex');
}

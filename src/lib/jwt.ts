import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Type assertion since we've checked it exists
const JWT_SECRET_KEY = JWT_SECRET as string;

export interface SessionPayload {
  sub: string; // email_hmac
  iat: number;
  exp: number;
}

/**
 * Create a short-lived session token
 */
export function createSessionToken(emailHmac: string): string {
  const payload = {
    sub: emailHmac,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
  };

  return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS256' });
}

/**
 * Verify and decode session token
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] }) as SessionPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

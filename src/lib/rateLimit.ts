import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest } from 'next/server';

// In-memory rate limiter for development - Very generous limits for testing
const rateLimiterMemory = new RateLimiterMemory({
  keyPrefix: 'goc_claim',
  points: 100, // 100 requests (very generous)
  duration: 60, // Per 60 seconds
});

// Email-specific rate limiter - Generous for testing
const emailRateLimiter = new RateLimiterMemory({
  keyPrefix: 'goc_claim_email',
  points: 20, // 20 email requests (was 3)
  duration: 60, // Per 1 minute (was 5 minutes)
});

// Code verification rate limiter - Very generous for testing
const codeRateLimiter = new RateLimiterMemory({
  keyPrefix: 'goc_claim_code',
  points: 50, // 50 attempts (was 5)
  duration: 60, // Per 1 minute (was 15 minutes)
});

/**
 * Get client IP from request
 */
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Rate limit by IP address
 */
export async function rateLimitByIP(req: NextRequest): Promise<void> {
  const ip = getClientIP(req);
  
  try {
    await rateLimiterMemory.consume(ip);
  } catch (rejRes: unknown) {
    const msBeforeNext = (rejRes as { msBeforeNext?: number })?.msBeforeNext || 0;
    
    throw new Error(`Rate limit exceeded. Try again in ${Math.round(msBeforeNext / 1000)} seconds.`);
  }
}

/**
 * Rate limit email requests
 */
export async function rateLimitEmail(identifier: string): Promise<void> {
  try {
    await emailRateLimiter.consume(identifier);
  } catch (rejRes: unknown) {
    const msBeforeNext = (rejRes as { msBeforeNext?: number })?.msBeforeNext || 0;
    throw new Error(`Email rate limit exceeded. Try again in ${Math.round(msBeforeNext / 1000)} seconds.`);
  }
}

/**
 * Rate limit code verification attempts
 */
export async function rateLimitCode(identifier: string): Promise<void> {
  try {
    await codeRateLimiter.consume(identifier);
  } catch (rejRes: unknown) {
    const msBeforeNext = (rejRes as { msBeforeNext?: number })?.msBeforeNext || 0;
    throw new Error(`Too many code attempts. Try again in ${Math.round(msBeforeNext / 1000)} seconds.`);
  }
}

/**
 * Check if rate limited without consuming points
 */
export async function checkRateLimit(identifier: string): Promise<{
  allowed: boolean;
  remainingPoints: number;
  msBeforeNext: number;
}> {
  try {
    const res = await rateLimiterMemory.get(identifier);
    return {
      allowed: (res?.remainingPoints || 5) > 0,
      remainingPoints: res?.remainingPoints || 5,
      msBeforeNext: res?.msBeforeNext || 0,
    };
  } catch {
    return {
      allowed: true,
      remainingPoints: 5,
      msBeforeNext: 0,
    };
  }
}

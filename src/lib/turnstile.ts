const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify Cloudflare Turnstile token
 */
export async function verifyTurnstileToken(token: string, ip?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn('TURNSTILE_SECRET_KEY not configured, skipping verification');
    return { success: true };
  }

  try {
    const formData = new FormData();
    formData.append('secret', TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const result: TurnstileResponse = await response.json();

    if (!result.success) {
      const errorCodes = result['error-codes'] || [];
      return {
        success: false,
        error: `Turnstile verification failed: ${errorCodes.join(', ')}`,
      };
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Turnstile verification error: ${errorMessage}`,
    };
  }
}

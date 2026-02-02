import { SiweMessage } from 'siwe';
import { randomBytes } from 'crypto';

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') || 'localhost:3000';

/**
 * Generate a secure nonce
 */
export function generateNonce(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Build SIWE message
 */
export function buildSiweMessage(
  address: string,
  nonce: string,
  chainId: number = 1
): SiweMessage {
  const message = new SiweMessage({
    domain: APP_DOMAIN,
    address,
    statement: 'Sign to confirm you own this wallet and authorize the GOC claim.',
    uri: `https://${APP_DOMAIN}`,
    version: '1',
    chainId,
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
  });

  return message;
}

/**
 * Verify SIWE signature
 */
export async function verifySiweSignature(
  message: string,
  signature: string,
  address: string,
  nonce: string
): Promise<{
  valid: boolean;
  error?: string;
  parsedMessage?: SiweMessage;
}> {
  try {
    const siweMessage = new SiweMessage(message);

    // Verify the message format and content
    if (siweMessage.address.toLowerCase() !== address.toLowerCase()) {
      return {
        valid: false,
        error: 'Address mismatch',
      };
    }

    if (siweMessage.nonce !== nonce) {
      return {
        valid: false,
        error: 'Nonce mismatch',
      };
    }

    if (siweMessage.domain !== APP_DOMAIN) {
      return {
        valid: false,
        error: 'Domain mismatch',
      };
    }

    // Check expiration
    if (siweMessage.expirationTime) {
      const expiration = new Date(siweMessage.expirationTime);
      if (expiration < new Date()) {
        return {
          valid: false,
          error: 'Message expired',
        };
      }
    }

    // Verify signature
    const result = await siweMessage.verify({
      signature,
      domain: APP_DOMAIN,
    });

    if (!result.success) {
      return {
        valid: false,
        error: result.error?.type || 'Signature verification failed',
      };
    }

    return {
      valid: true,
      parsedMessage: siweMessage,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      valid: false,
      error: `SIWE verification error: ${errorMessage}`,
    };
  }
}

/**
 * Create SIWE message string for signing
 */
export function createSiweMessageString(
  address: string,
  nonce: string,
  chainId: number = 1
): string {
  const message = buildSiweMessage(address, nonce, chainId);
  return message.prepareMessage();
}

/**
 * Validate SIWE message format
 */
export function validateSiweMessage(messageString: string): {
  valid: boolean;
  error?: string;
  message?: SiweMessage;
} {
  try {
    const message = new SiweMessage(messageString);
    
    // Basic validation
    if (!message.address || !message.domain || !message.nonce) {
      return {
        valid: false,
        error: 'Missing required fields',
      };
    }

    return {
      valid: true,
      message,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      valid: false,
      error: `Invalid SIWE message format: ${errorMessage}`,
    };
  }
}

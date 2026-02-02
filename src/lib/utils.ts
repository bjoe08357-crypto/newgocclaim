import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NextRequest } from 'next/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function verifyBasicAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return { success: false, error: 'Missing or invalid authorization header' };
  }

  try {
    const credentials = Buffer.from(authHeader.substring(6), 'base64').toString();
    const [username, password] = credentials.split(':');

    // Use the same check as upload-csv route
    // Debug logging removed for production

    const isValid = (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    );

    if (isValid) {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch {
    return { success: false, error: 'Invalid authorization format' };
  }
}

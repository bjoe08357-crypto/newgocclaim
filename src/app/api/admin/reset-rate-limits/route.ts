import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    // Basic auth check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
    const [username, password] = credentials.split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Clear all rate limit data by restarting the server
    // This is a simple way to reset in-memory rate limiters
    console.warn('Admin requested rate limit reset');
    
    return NextResponse.json({
      success: true,
      message: 'Rate limits will be reset on next server restart. For immediate reset, restart the dev server.',
    });

  } catch (error: unknown) {
    console.error('Reset rate limits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

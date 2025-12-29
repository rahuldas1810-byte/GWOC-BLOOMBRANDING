import { NextRequest, NextResponse } from 'next/server';
import { authenticate, clearAuthCookie } from '@/backend';

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticate(request);

    if ('error' in authResult) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.error,
        },
        { status: authResult.status }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Logout failed',
      },
      { status: 500 }
    );
  }
}

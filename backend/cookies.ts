import { NextResponse } from 'next/server';

if (typeof window !== 'undefined') {
  throw new Error('Cookie utilities can only be used on the server');
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set('adminToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete('adminToken');
}


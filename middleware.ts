import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CRITICAL: Skip ALL API routes - they handle their own authentication
  // API routes must NEVER be redirected to HTML pages
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const publicAdminRoutes = [
  '/admin/login',
  '/admin/verify-otp',
  '/admin/reset-password',
]
  // Protect admin PAGE routes only (not API routes)
  // Only redirect page routes to login, never API routes
  if (
  pathname.startsWith('/admin') &&
  !publicAdminRoutes.some(route => pathname.startsWith(route))
) {
  const token = request.cookies.get('adminToken')?.value;

  if (!token || token.trim() === '') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

  return NextResponse.next();
}

export const config = {
  // Match admin pages only, explicitly exclude API routes
  // This ensures middleware only runs for /admin/* pages, not /api/admin/* routes
  matcher: [
    '/admin/:path*',
  ],
};


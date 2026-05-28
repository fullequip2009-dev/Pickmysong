import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/venues/create'];
const VENUE_OWNER_ROUTES = ['/dashboard/venue'];
const ADMIN_ROUTES = ['/dashboard/admin'];

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: any } }) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
    if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', req.url));
      }
    }
    if (VENUE_OWNER_ROUTES.some(r => pathname.startsWith(r))) {
      if (token?.role !== 'venue_owner' && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', req.url));
      }
    }
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        if (PROTECTED_ROUTES.some(r => pathname.startsWith(r))) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/venues/create',
    '/api/votes/:path*',
  ],
};

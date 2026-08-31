import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isBaseRoute = request.nextUrl.pathname === '/';
  const isUserRoute = request.nextUrl.pathname.startsWith('/user');

  // Allow static files, api routes, Next.js internal files
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (isBaseRoute) {
    const response = NextResponse.next();
    response.cookies.delete('admin_session');
    return response;
  }

  // Allow user dashboard
  if (isUserRoute) {
    return NextResponse.next();
  }

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

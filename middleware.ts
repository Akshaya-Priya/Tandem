import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const protectedPaths = ['/users', '/events', '/tasks', '/participation', '/feedback'];
  const authPaths = ['/login', '/register', '/reset-password'];

  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  // Redirect unauthenticated users to the login page for protected paths
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from auth pages to the home page
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect unauthenticated users accessing the home page to the login page
  if (req.nextUrl.pathname === '/' && !session) {
    // Clear Supabase auth cookies
    res.cookies.delete('sb-access-token');
    res.cookies.delete('sb-refresh-token');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

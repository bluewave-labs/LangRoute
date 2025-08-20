import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@lib/auth';

import { isPublicRoute } from '@lib/middleware/publicRoutes';

/**
 * Root-level authentication middleware for LangRoute.
 * Protects all routes except public ones with session-based authentication.
 *
 * Uses NextAuth v5 `auth` wrapper for optimal edge compatibility and performance.
 * Redirects unauthenticated users to login with callback URL preservation.
 */
export default auth((req) => {
	const { pathname } = req.nextUrl;

	// Skip authentication for public routes
	if (isPublicRoute(pathname)) {
		return NextResponse.next();
	}

	// At this point, req.auth is available due to the auth() wrapper
	if (!req.auth) {
		return redirectToLogin(req, pathname);
	}

	// Redirect authenticated users away from auth pages to default dashboard
	if (['/login', '/register', '/forgot-password'].includes(pathname)) {
		return NextResponse.redirect(new URL('/dashboard', req.url));
	}

	return NextResponse.next();
});

/**
 * Helper function to redirect to login with callback URL preservation.
 */
function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
	const loginUrl = new URL('/login', request.url);
	loginUrl.searchParams.set('callbackUrl', pathname);
	return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

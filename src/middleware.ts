import { NextRequest, NextResponse } from 'next/server';

import { isPublicRoute } from '@/lib/middleware/public-routes';

/**
 * Root-level authentication middleware for LangRoute.
 * Protects all routes except public ones with session-based authentication.
 *
 * Uses NextAuth session validation via API call (Edge runtime compatible).
 * Redirects unauthenticated users to login with callback URL preservation.
 */
export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip authentication for public routes
	if (isPublicRoute(pathname)) {
		return NextResponse.next();
	}

	// Check for NextAuth session cookies first (performance optimization)
	const sessionToken =
		request.cookies.get('next-auth.session-token') ||
		request.cookies.get('__Secure-next-auth.session-token');

	if (!sessionToken) {
		return redirectToLogin(request, pathname);
	}

	// Validate session by calling NextAuth session endpoint
	// This ensures the cookie is valid and not expired/signed-out
	try {
		const sessionResponse = await fetch(new URL('/api/auth/session', request.url), {
			headers: {
				cookie: request.headers.get('cookie') || '',
			},
		});

		if (!sessionResponse.ok) {
			return redirectToLogin(request, pathname);
		}

		const session = await sessionResponse.json();

		if (!session?.user) {
			return redirectToLogin(request, pathname);
		}

		// Redirect authenticated users away from auth pages
		if (['/login', '/register', '/forgot-password'].includes(pathname)) {
			return NextResponse.redirect(new URL('/models', request.url));
		}

		return NextResponse.next();
	} catch {
		return redirectToLogin(request, pathname);
	}
}

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

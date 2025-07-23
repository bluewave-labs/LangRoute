// import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// import { MIDDLEWARE_MATCHER_PATTERN } from '@/lib/config/routesConfig';

/**
 * Middleware placeholder for authentication and rate-limiting logic in Next.js.
 *
 * Currently passes requests through without modification.
 */
export function middleware() {
	// TODO: Add Auth logic
	// TODO: Add rate-limit logic
	return NextResponse.next();
}

// export default withAuth({
// 	pages: {
// 		// TODO: Define sign-in page
// 	},
// });

export const config = {
	// matcher: [MIDDLEWARE_MATCHER_PATTERN],
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};

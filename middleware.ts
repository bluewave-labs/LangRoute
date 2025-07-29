import { withAuth } from 'next-auth/middleware';

export default withAuth({
	pages: { signIn: '/login' },
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - / (landing page)
		 * - /login, /register, /forgot-password, /reset-password (auth pages)
		 * - /403 (forbidden page)
		 * - /_api/auth/ (NextAuth API routes using _api)
		 * - /invite/ (future invite pages)
		 * - /_next/ (Next.js internals)
		 * - /favicon.ico (static assets)
		 */
		'/((?!$|login$|register$|forgot-password$|reset-password.*$|403$|_api/auth/.*|invite/.*|_next/.*|favicon.ico$).*)',
	],
};

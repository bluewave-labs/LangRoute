import { auth } from '@/lib/auth';
import { MIDDLEWARE_MATCHER_PATTERN } from '@/middleware/matcher';

export default auth((req) => {
	// Access the user session via req.auth
	const { pathname } = req.nextUrl;

	// If user is not authenticated and not on a public route, redirect to login
	if (!req.auth && pathname !== '/login') {
		const newUrl = new URL('/login', req.nextUrl.origin);
		return Response.redirect(newUrl);
	}

	// Optional: Redirect authenticated users away from auth pages
	if (req.auth && ['/login', '/register', '/forgot-password'].includes(pathname)) {
		const newUrl = new URL('/', req.nextUrl.origin);
		return Response.redirect(newUrl);
	}

	// Allow the request to proceed
	return;
});

export const config = {
	matcher: [MIDDLEWARE_MATCHER_PATTERN],
};

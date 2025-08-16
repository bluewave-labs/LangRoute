/**
 * Public routes that bypass authentication.
 * Simple string patterns for easy maintenance - no regex knowledge required.
 */

/**
 * Exact match public routes.
 * These routes require perfect path matching.
 */
export const PUBLIC_ROUTES = [
	'/', // landing page
	'/login', // authentication pages
	'/register',
	'/forgot-password',
	'/403', // forbidden page
] as const;

/**
 * Public route prefixes that match any sub-path.
 * These will match the path and any nested routes.
 */
export const PUBLIC_ROUTE_PREFIXES = [
	'/reset-password', // password reset with tokens
	'/api/auth', // NextAuth.js routes
	'/invite', // team invitation pages (future)
	'/_next', // Next.js asset pipeline
] as const;

/**
 * Static files and special cases that should always be public.
 */
export const PUBLIC_STATIC_FILES = ['/favicon.ico', '/robots.txt', '/sitemap.xml'] as const;

/**
 * Fast utility to check if a pathname is public.
 * Uses simple string operations instead of regex for better performance.
 *
 * @param pathname - The URL pathname to check
 * @returns true if the route is public, false if it requires authentication
 */
export function isPublicRoute(pathname: string): boolean {
	// Exact matches - fastest check first
	if ((PUBLIC_ROUTES as readonly string[]).includes(pathname)) {
		return true;
	}

	// Static files
	if ((PUBLIC_STATIC_FILES as readonly string[]).includes(pathname)) {
		return true;
	}

	// Prefix matches - check if path starts with any public prefix
	for (const prefix of PUBLIC_ROUTE_PREFIXES) {
		if (pathname.startsWith(prefix)) {
			return true;
		}
	}

	// Default to requiring authentication
	return false;
}

/**
 * Public routes that bypass root middleware auth checks.
 * Add patterns here; the matcher regex is built automatically.
 */
export const PUBLIC_ROUTE_PATTERNS: readonly RegExp[] = [
	/^\/$/, // landing
	/^\/login$/, // auth pages
	/^\/register$/,
	/^\/forgot-password$/,
	/^\/reset-password.*$/,
	/^\/403$/, // forbidden page
	/^\/api\/auth\/.*/, // next-auth & auth APIs
	/^\/invite\/.*/, // invite splash (future)
	/^\/_next\/.*/, // next asset pipeline
	/^\/favicon.ico$/,
];

/** Utility for ad-hoc checks inside route handlers */
export function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTE_PATTERNS.some((rx) => rx.test(pathname));
}

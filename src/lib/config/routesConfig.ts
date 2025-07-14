export const PUBLIC_ROUTE_PATTERNS: readonly RegExp[] = [
	/^\/$/,
	/^\/auth\/.*/,
	/^\/api\/auth\/.*/,
	/^\/_next\/.*/,
	/^\/favicon\.ico$/,
];

/**
 * Determines whether the given pathname matches any public route pattern.
 *
 * @param pathname - The URL path to check
 * @returns True if the pathname is considered a public route; otherwise, false
 */
export function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTE_PATTERNS.some((rx) => rx.test(pathname));
}

export const MIDDLEWARE_MATCHER_PATTERN: string = (() => {
	const parts = PUBLIC_ROUTE_PATTERNS.map((rx) => rx.source.replace('^\\/', '')).join('|');
	return `^/(?!(${parts})).*`;
})();

export const MIDDLEWARE_MATCHER: RegExp = new RegExp(MIDDLEWARE_MATCHER_PATTERN);

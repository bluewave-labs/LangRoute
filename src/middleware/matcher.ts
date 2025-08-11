import { PUBLIC_ROUTE_PATTERNS } from './public-routes';

/**
 * Builds a negative-look-ahead matcher for Next.js middleware config.
 * Example output:  ^\/(?!((?:$)|(?:login)|(?:api\/auth\/.*))).*
 */
export const MIDDLEWARE_MATCHER_PATTERN: string = (() => {
	const joined = PUBLIC_ROUTE_PATTERNS.map((rx) =>
		// strip leading ^\/ and trailing $/.* for clean insertion
		rx.source.replace(/^\^\\?\//, '').replace(/\$?$/, ''),
	).join('|');
	return `^/(?!(${joined})).*`;
})();

export const MIDDLEWARE_MATCHER: RegExp = new RegExp(MIDDLEWARE_MATCHER_PATTERN);

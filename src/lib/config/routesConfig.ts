export const PUBLIC_ROUTE_PATTERNS: readonly RegExp[] = [
  /^\/$/,
  /^\/auth\/.*/,
  /^\/api\/auth\/.*/,
  /^\/_next\/.*/,
  /^\/favicon\.ico$/,
];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PATTERNS.some((rx) => rx.test(pathname));
}

export const MIDDLEWARE_MATCHER_PATTERN: string = (() => {
  const parts = PUBLIC_ROUTE_PATTERNS.map((rx) =>
    rx.source.replace('^\\/', '')
  ).join('|');
  return `^/(?!(${parts})).*`;
})();

export const MIDDLEWARE_MATCHER: RegExp = new RegExp(
  MIDDLEWARE_MATCHER_PATTERN
);

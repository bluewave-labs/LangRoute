import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

import { MIDDLEWARE_MATCHER_PATTERN } from '@/lib/config/routesConfig';

export function middleware() {
	// TODO: Add Auth logic
	// TODO: Add rate-limit logic
	return NextResponse.next();
}

export default withAuth({
	pages: {
		// TODO: Define sign-in page
	},
});

export const config = {
	matcher: [MIDDLEWARE_MATCHER_PATTERN],
};

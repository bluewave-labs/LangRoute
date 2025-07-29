import { withAuth } from 'next-auth/middleware';

import { MIDDLEWARE_MATCHER_PATTERN } from '@/middleware/matcher';

export default withAuth({
	pages: { signIn: '/login' },
});

export const config = {
	matcher: [MIDDLEWARE_MATCHER_PATTERN],
};

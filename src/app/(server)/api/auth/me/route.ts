import { NextResponse } from 'next/server';

import { auth } from '@lib/auth';

import { handleApiError } from '@services';

/**
 * GET /api/auth/me
 *
 * Returns the current authenticated user's session data.
 * Used by frontend components to determine authentication state
 * and user permissions without requiring client-side session parsing.
 *
 * @returns JSON response containing user data or null if not authenticated
 */
export async function GET(): Promise<NextResponse> {
	try {
		// Retrieve server-side session using NextAuth
		const session = await auth();

		// Return null for unauthenticated requests (not an error condition)
		if (!session?.user) {
			return NextResponse.json({ user: null }, { status: 200 });
		}

		// Return user data for authenticated sessions
		return NextResponse.json({ user: session.user }, { status: 200 });
	} catch (error: unknown) {
		return handleApiError('me', error);
	}
}

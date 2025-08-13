import { NextResponse } from 'next/server';

import { AuthService, createErrorResponse, handleApiError } from '@services';

import { RegisterSchema } from '@lib/validation/authSchemas';

/**
 * POST /api/auth/register
 *
 * Handles user registration with email and password credentials.
 * Creates a new admin user account with secure password hashing.
 * @param request - HTTP request containing registration data in JSON body
 * @returns JSON response with success status or error details
 */
export async function POST(request: Request): Promise<NextResponse> {
	try {
		// Parse and validate request body
		const body = await request.json().catch(() => null);
		const parsed = RegisterSchema.safeParse(body);

		if (!parsed.success) {
			return createErrorResponse('Validation error', 422);
		}

		// Delegate business logic to service layer
		await AuthService.registerUser(parsed.data);

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error: unknown) {
		return handleApiError('register', error);
	}
}

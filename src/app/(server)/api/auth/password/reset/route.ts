import { NextResponse } from 'next/server';

import { AuthService, createErrorResponse, handleApiError } from '@services';

import { ResetPasswordSchema } from '@lib/validation/auth.schemas';

/**
 * POST /api/auth/reset
 *
 * Completes password reset flow using a valid token from the forgot password process.
 * Atomically updates the user's password and removes the reset token for security.
 *
 * @param request - HTTP request containing reset token and new password in JSON body
 * @returns JSON response indicating success or failure with appropriate error details
 */
export async function POST(request: Request): Promise<NextResponse> {
	try {
		// Parse and validate request body
		const body = await request.json().catch(() => null);
		const parsed = ResetPasswordSchema.safeParse(body);

		if (!parsed.success) {
			return createErrorResponse('Validation error', 422);
		}

		// Delegate password reset logic to service layer
		await AuthService.resetPassword(parsed.data);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: unknown) {
		return handleApiError('reset', error);
	}
}

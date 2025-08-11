import { NextResponse } from 'next/server';

import { ForgotPasswordSchema } from '@/lib/validation/authSchemas';
import { AuthService, createErrorResponse, handleApiError } from '@/services';

/**
 * POST /api/auth/forgot
 *
 * Initiates password reset process by generating a secure token
 * and associating it with the user's email address. For OAuth users
 * or non-existent accounts, responds successfully but takes no action
 * to prevent email enumeration attacks.
 * @param request - HTTP request containing email address in JSON body
 * @returns JSON response with reset token info (development only) or success status
 */
export async function POST(request: Request): Promise<NextResponse> {
	try {
		// Parse and validate request body
		const body = await request.json().catch(() => null);
		const parsed = ForgotPasswordSchema.safeParse(body);

		if (!parsed.success) {
			return createErrorResponse('Invalid email', 422);
		}

		// Delegate to service layer for token generation
		const result = await AuthService.forgotPassword(parsed.data);

		// In development, include token for testing; in production, only show success or provider info
		const payload =
			process.env.NODE_ENV !== 'production' ? { success: true, ...result } : { success: true };

		return NextResponse.json(payload, { status: 200 });
	} catch (error: unknown) {
		return handleApiError('forgot', error);
	}
}

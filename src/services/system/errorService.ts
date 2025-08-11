import { NextResponse } from 'next/server';

import { logError } from '@/lib/utils/logger';

/**
 * Creates a consistent JSON error response for API routes.
 *
 * @param message - The error message to return in the response.
 * @param status - The HTTP status code for the response.
 * @param details - Optional error details for logging.
 * @returns A NextResponse object containing the error message and status.
 */

export function createErrorResponse(
	message: string,
	status: number,
	details?: unknown,
): NextResponse {
	logError(`[${new Date().toISOString()}] ${message}`, details);
	return NextResponse.json({ message }, { status });
}

/**
 * Handles errors in API route catch blocks with consistent logging and response formatting.
 * Automatically extracts status codes from ServiceError instances and provides fallback handling.
 *
 * @param routeName - Name of the API route for logging context (e.g., 'register', 'forgot')
 * @param error - The caught error object (unknown type for safety)
 * @returns A standardized NextResponse with appropriate status code and message
 */
export function handleApiError(routeName: string, error: unknown): NextResponse {
	logError(`[${routeName}]`, error);

	// Handle ServiceError instances with custom status codes
	if (error instanceof ServiceError) {
		return createErrorResponse(error.message, error.status);
	}

	// Handle standard Error instances
	if (error instanceof Error) {
		return createErrorResponse(error.message, 500);
	}

	// Handle unknown error types
	return createErrorResponse('Internal server error', 500);
}

/**
 * Custom error class for service-level errors that API routes can translate into HTTP codes.
 */
export class ServiceError extends Error {
	/**
	 * Constructs a new ServiceError.
	 *
	 * @param message - The error message.
	 * @param status - The HTTP status code (default: 500).
	 */
	constructor(
		message: string,
		public status: number = 500,
	) {
		super(message);
		this.name = 'ServiceError';
	}
}

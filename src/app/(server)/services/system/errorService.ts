import { NextResponse } from 'next/server';

import { randomUUID } from 'crypto';

import { logError } from '@lib/utils/logger';

/**
 * Canonical error codes used in API responses.
 */
export type ErrorCode =
	| 'BAD_REQUEST'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'METHOD_NOT_ALLOWED'
	| 'CONFLICT'
	| 'VALIDATION_ERROR'
	| 'TOO_MANY_REQUESTS'
	| 'INTERNAL';

/**
 * Maps an HTTP status code to a canonical error code.
 *
 * @param status - The HTTP status code.
 * @returns The corresponding canonical error code.
 */
function statusToCode(status: number): ErrorCode {
	switch (status) {
		case 400:
			return 'BAD_REQUEST';
		case 401:
			return 'UNAUTHORIZED';
		case 403:
			return 'FORBIDDEN';
		case 404:
			return 'NOT_FOUND';
		case 405:
			return 'METHOD_NOT_ALLOWED';
		case 409:
			return 'CONFLICT';
		case 422:
			return 'VALIDATION_ERROR';
		case 429:
			return 'TOO_MANY_REQUESTS';
		default:
			return 'INTERNAL';
	}
}

/**
 * Generates a best-effort unique request ID.
 * Useful for correlating logs to responses.
 *
 * @returns A unique request ID string.
 */
function makeRequestId(): string {
	// Prefer Web Crypto if available (Edge/runtime-safe), fall back to Node crypto or a random string.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const anyCrypto = (globalThis as any).crypto;
	if (anyCrypto?.randomUUID) return anyCrypto.randomUUID();
	try {
		return randomUUID();
	} catch {
		return Math.random().toString(36).slice(2);
	}
}

/**
 * Constructs a standard error payload for API responses.
 *
 * @param message - The error message to include in the payload.
 * @param status  - The HTTP status code associated with the error.
 * @param code    - Optional canonical error code (defaults to mapping from status).
 * @returns An object representing the error payload.
 */
function errorPayload(message: string, status: number, code?: ErrorCode) {
	return {
		error: {
			message,
			code: code ?? statusToCode(status),
		},
		requestId: makeRequestId(),
		ts: new Date().toISOString(),
	};
}

/**
 * Creates a consistent JSON error response for API routes.
 * Logs error details server-side but returns a clean error envelope to clients.
 *
 * @param message - The error message to return to the client.
 * @param status  - The HTTP status code for the response.
 * @param details - Optional additional details for server-side logging.
 * @returns A Next.js JSON response with the error payload.
 */
export function createErrorResponse(
	message: string,
	status: number,
	details?: unknown,
): NextResponse {
	// Log with details (server-side) but return a clean envelope to clients
	logError(`[${statusToCode(status)}] ${message}`, details);
	return NextResponse.json(errorPayload(message, status), { status });
}

/**
 * Custom error class for service-layer failures.
 * Routes should catch this and translate it via `handleApiError`.
 */
export class ServiceError extends Error {
	/**
	 * Constructs a new ServiceError instance.
	 *
	 * @param message - The error message.
	 * @param status  - The HTTP status code (default: 500).
	 * @param code    - Optional canonical error code (defaults to mapping from status).
	 * @param details - Optional additional details for server-side logging.
	 */
	constructor(
		message: string,
		public status: number = 500,
		/**
		 * Optional canonical code override (otherwise mapped from status).
		 */
		public code?: ErrorCode,
		/**
		 * Optional details that will be logged server-side.
		 */
		public details?: unknown,
	) {
		super(message);
		this.name = 'ServiceError';
	}
}

/**
 * Centralized error handling helper for API route handlers.
 * Translates errors into JSON error responses and logs them with context.
 *
 * @param routeName - The name of the route where the error occurred.
 * @param error     - The error to handle (can be a `ServiceError`, `Error`, or unknown).
 * @returns A Next.js JSON response with the appropriate error payload.
 */
export function handleApiError(routeName: string, error: unknown): NextResponse {
	if (error instanceof ServiceError) {
		logError(`[route:${routeName}] ${error.message}`, {
			status: error.status,
			code: error.code,
			details: error.details,
		});
		return NextResponse.json(errorPayload(error.message, error.status, error.code), {
			status: error.status,
		});
	}

	if (error instanceof Error) {
		logError(`[route:${routeName}] ${error.message}`, { stack: error.stack });
		return NextResponse.json(errorPayload('Internal server error', 500), { status: 500 });
	}

	logError(`[route:${routeName}] Unknown error`, { error });
	return NextResponse.json(errorPayload('Internal server error', 500), { status: 500 });
}

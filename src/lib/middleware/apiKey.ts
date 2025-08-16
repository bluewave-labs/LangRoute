import prisma from '@/db/prisma';

import { ServiceError, createErrorResponse } from '@services';

/**
 * Validates the API key from the request headers and retrieves the associated user ID.
 *
 * @param request - HTTP request containing the authorization header.
 * @returns User ID associated with the API key.
 * @throws ServiceError if the API key is invalid or missing.
 */
export async function requireApiKey(request: Request): Promise<string> {
	const authHeader = request.headers.get('authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

	if (!token) {
		throw new ServiceError('Unauthorized', 401);
	}

	const record = await prisma.apiKey.findUnique({
		where: { key: token },
		select: { userId: true },
	});

	if (!record) {
		throw new ServiceError('Unauthorized', 401);
	}

	return record.userId;
}

/**
 * Middleware to enforce API key validation before executing the handler.
 *
 * @param handler - The request handler to execute after API key validation.
 * @returns A wrapped handler that validates the API key.
 */
export function withApiKey(handler: (req: Request) => Promise<Response>) {
	return async (request: Request) => {
		try {
			await requireApiKey(request);
			return await handler(request);
		} catch (err) {
			if (err instanceof ServiceError) {
				return createErrorResponse(err.message, err.status);
			}
			// Let route-level handleApiError catch non-ServiceError exceptions if thrown upward
			return createErrorResponse('Internal server error', 500);
		}
	};
}

/**
 * Retrieves the user ID from the API key in the request headers.
 *
 * @param request - HTTP request containing the authorization header.
 * @returns User ID associated with the API key.
 * @throws ServiceError if the API key is invalid or missing.
 */
export async function getUserIdFromApiKey(request: Request): Promise<string> {
	return await requireApiKey(request);
}

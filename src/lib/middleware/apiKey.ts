import { ApiKeyService, ServiceError, createErrorResponse } from '@services';

/**
 * Resolves the API key context from the request headers.
 *
 * @param request - HTTP request containing the authorization header.
 * @returns An object containing the user ID and key ID associated with the API key.
 * @throws ServiceError if the API key is invalid or missing.
 */
export async function resolveApiKeyContext(
	request: Request,
): Promise<{ userId: string; keyId: string }> {
	const authHeader = request.headers.get('authorization');
	const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) {
		throw new ServiceError('Unauthorized', 401);
	}
	return ApiKeyService.getContextFromToken(token);
}

/**
 * Middleware to enforce API key validation before executing the handler.
 *
 * @param handler - The request handler to execute after API key validation.
 * @returns A wrapped handler that validates the API key and provides context.
 */
export function withApiKey(
	handler: (req: Request, ctx: { userId: string; keyId: string }) => Promise<Response>,
) {
	return async (request: Request) => {
		try {
			const ctx = await resolveApiKeyContext(request);
			return await handler(request, ctx);
		} catch (err) {
			if (err instanceof ServiceError) {
				return createErrorResponse(err.message, err.status);
			}
			// Bubble unknown errors to the route so it can attach route-specific logs
			throw err;
		}
	};
}

import { ApiKeyService, authenticate, createErrorResponse, handleApiError } from '@services';

import { ApiKeyIdParamSchema } from '@lib/validation/apiKey.schemas';

/**
 * Deletes a specific API key owned by the authenticated user.
 *
 * @param _request - The HTTP request object (unused).
 * @param context  - Context containing the route parameters.
 * @returns A response with status 204 on successful deletion.
 * @throws ServiceError if the API key ID is invalid or the deletion fails.
 */
export async function DELETE(
	_request: Request,
	context: { params: Promise<{ id: string }> },
): Promise<Response> {
	try {
		// Validate path params (UUID in Zod v4 syntax)
		const params = await context.params;
		const parsed = ApiKeyIdParamSchema.safeParse(params);
		if (!parsed.success) {
			return createErrorResponse('Invalid API key ID', 422, parsed.error.format());
		}

		const userId = await authenticate();

		await ApiKeyService.deleteApiKey({
			apiKeyId: parsed.data.id,
			userId,
		});

		// No content on successful delete
		return new Response(null, { status: 204 });
	} catch (error) {
		return handleApiError('apikeys-delete', error);
	}
}

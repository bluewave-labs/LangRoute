import { NextResponse } from 'next/server';

import { ApiKeyService, authenticate, createErrorResponse, handleApiError } from '@services';

import { CreateApiKeySchema } from '@lib/validation/apiKey.schemas';

/**
 * GET /api/apikeys
 *
 * Retrieves all API keys for the authenticated user.
 * Returns an array of API key objects containing id, key, name, and creation date.
 *
 * @returns JSON response with array of user's API keys
 */
export async function GET(): Promise<NextResponse> {
	try {
		const userId = await authenticate();
		const apiKeys = await ApiKeyService.getUserApiKeys(userId);

		return NextResponse.json({ apiKeys });
	} catch (error) {
		return handleApiError('apikeys-get', error);
	}
}

/**
 * POST /api/apikeys
 *
 * Creates a new API key for the authenticated user.
 * Accepts optional name parameter for API key identification.
 *
 * @param request - HTTP request containing optional API key metadata
 * @returns JSON response with created API key details
 */
export async function POST(request: Request): Promise<NextResponse> {
	try {
		const userId = await authenticate();
		const body = await request.json().catch(() => ({}));

		const parsed = CreateApiKeySchema.safeParse(body);

		if (!parsed.success) {
			return createErrorResponse('Validation failed', 422, parsed.error.format());
		}

		const apiKey = await ApiKeyService.createApiKey({
			userId,
			...parsed.data,
		});

		return NextResponse.json({ apiKey }, { status: 201 });
	} catch (error) {
		return handleApiError('apikeys-create', error);
	}
}

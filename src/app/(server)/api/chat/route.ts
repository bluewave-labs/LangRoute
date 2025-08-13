import { NextResponse } from 'next/server';

import { ChatCompletionSchema } from '@/lib/validation/chatSchemas';

import { ChatService, createErrorResponse, handleApiError } from '@services';

import { getUserIdFromApiKey, withApiKey } from '@lib/middleware/apiKey';

/**
 * POST /api/chat
 *
 * OpenAI-compatible chat completions endpoint.
 * Accepts chat messages and returns AI-generated responses.
 * Supports streaming and various completion parameters.
 *
 * @param request - HTTP request containing chat completion data.
 * @returns JSON response with chat completion or streamed response.
 */
export const POST = withApiKey(async (request: Request): Promise<Response> => {
	try {
		const body = await request.json().catch(() => null);
		const parsed = ChatCompletionSchema.safeParse(body);

		if (!parsed.success) {
			return createErrorResponse('Validation failed', 422, parsed.error.format());
		}

		// We’ll unify token→user lookup later; for now this gives us the userId
		const userId = await getUserIdFromApiKey(request);

		const response = await ChatService.processCompletion(parsed.data, userId);
		return NextResponse.json(response);
	} catch (error) {
		return handleApiError('chat', error);
	}
});

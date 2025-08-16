import { NextResponse } from 'next/server';

import { ChatService, createErrorResponse, handleApiError } from '@services';

import { withApiKey } from '@lib/middleware/apiKey';
import { ChatCompletionSchema } from '@lib/validation/chat.schemas';

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
export const POST = withApiKey(async (request: Request, ctx): Promise<Response> => {
	try {
		const body = await request.json().catch(() => null);
		const parsed = ChatCompletionSchema.safeParse(body);

		if (!parsed.success) {
			return createErrorResponse('Validation failed', 422, parsed.error.format());
		}

		const response = await ChatService.processCompletion(parsed.data, ctx.userId);
		return NextResponse.json(response);
	} catch (error) {
		return handleApiError('chat', error);
	}
});

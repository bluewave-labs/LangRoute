import { ServiceError } from '@services';

export interface ChatRequest {
	model: string;
	messages: Array<{
		role: 'system' | 'user' | 'assistant';
		content: string;
	}>;
	temperature?: number;
	max_tokens?: number;
	stream?: boolean;
}

export interface ChatResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: {
			role: string;
			content: string;
		};
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

/**
 * Chat Service
 * Handles chat completions and proxy logic to LLM providers
 */
export const ChatService = {
	/**
	 * Processes chat completion request
	 * @param data - Chat completion request data
	 * @param _userId - Authenticated user ID (reserved for future implementation)
	 * @returns Chat completion response or stream
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async processCompletion(data: ChatRequest, _userId: string): Promise<ChatResponse> {
		// TODO: Implement actual chat completion logic
		// _userId will be used for rate limiting, usage tracking, and provider selection

		if (!data.model || !data.messages) {
			throw new ServiceError('Model and messages are required', 400);
		}

		// For now, return a mock response
		return {
			id: `chatcmpl-${Date.now()}`,
			object: 'chat.completion',
			created: Math.floor(Date.now() / 1000),
			model: data.model,
			choices: [
				{
					index: 0,
					message: {
						role: 'assistant',
						content:
							'This is a placeholder response. Chat functionality will be implemented in a future update.',
					},
					finish_reason: 'stop',
				},
			],
			usage: {
				prompt_tokens: 10,
				completion_tokens: 15,
				total_tokens: 25,
			},
		};
	},

	/**
	 * Validates chat request parameters
	 * @param data - Chat request data to validate
	 * @throws ServiceError when validation fails
	 */
	validateChatRequest(data: ChatRequest): void {
		if (!data.model) {
			throw new ServiceError('Model is required', 400);
		}

		if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
			throw new ServiceError('Messages array is required and must not be empty', 400);
		}

		// Validate message structure
		for (const message of data.messages) {
			if (!message.role || !['system', 'user', 'assistant'].includes(message.role)) {
				throw new ServiceError('Invalid message role', 400);
			}
			if (!message.content || typeof message.content !== 'string') {
				throw new ServiceError('Message content is required and must be a string', 400);
			}
		}

		// Validate optional parameters
		if (data.temperature !== undefined && (data.temperature < 0 || data.temperature > 2)) {
			throw new ServiceError('Temperature must be between 0 and 2', 400);
		}

		if (data.max_tokens !== undefined && data.max_tokens < 1) {
			throw new ServiceError('Max tokens must be a positive integer', 400);
		}
	},
};

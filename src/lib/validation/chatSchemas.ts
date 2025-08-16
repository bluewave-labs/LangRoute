import { z } from 'zod';

/**
 * Schema for chat message
 */
const ChatMessageSchema = z.object({
	role: z.enum(['system', 'user', 'assistant']),
	content: z.string().min(1, 'Message content cannot be empty'),
});

/**
 * Schema for chat completion request
 */
export const ChatCompletionSchema = z.object({
	model: z.string().min(1, 'Model is required'),
	messages: z.array(ChatMessageSchema).min(1, 'At least one message is required'),
	temperature: z.number().min(0).max(2).optional(),
	max_tokens: z.number().int().positive().optional(),
	stream: z.boolean().optional(),
	top_p: z.number().min(0).max(1).optional(),
	frequency_penalty: z.number().min(-2).max(2).optional(),
	presence_penalty: z.number().min(-2).max(2).optional(),
	stop: z.union([z.string(), z.array(z.string()).max(4)]).optional(),
});

export type ChatCompletionData = z.infer<typeof ChatCompletionSchema>;
export type ChatMessageData = z.infer<typeof ChatMessageSchema>;

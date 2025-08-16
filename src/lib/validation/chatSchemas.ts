// src/lib/validation/chatSchemas.ts
import { z } from 'zod';

import { PARAMETER_LIMITS, ROLE_IDS } from '@/lib/config/chat';

/**
 * Zod schemas define only the request SHAPE and generic bounds.
 * Model-specific business limits should live in services.
 */

export const ChatMessageSchema = z.object({
	role: z.enum(ROLE_IDS),
	content: z.string().min(1, 'Message content cannot be empty'),
});

export const ChatCompletionSchema = z.object({
	model: z.string().min(1, 'Model is required'),
	messages: z.array(ChatMessageSchema).min(1, 'At least one message is required'),

	temperature: z
		.number()
		.min(PARAMETER_LIMITS.temperature.min)
		.max(PARAMETER_LIMITS.temperature.max)
		.optional(),
	max_tokens: z
		.number()
		.int()
		.min(PARAMETER_LIMITS.max_tokens.min)
		.max(PARAMETER_LIMITS.max_tokens.max)
		.optional(),
	stream: z.boolean().optional(),
	top_p: z.number().min(PARAMETER_LIMITS.top_p.min).max(PARAMETER_LIMITS.top_p.max).optional(),
	frequency_penalty: z
		.number()
		.min(PARAMETER_LIMITS.frequency_penalty.min)
		.max(PARAMETER_LIMITS.frequency_penalty.max)
		.optional(),
	presence_penalty: z
		.number()
		.min(PARAMETER_LIMITS.presence_penalty.min)
		.max(PARAMETER_LIMITS.presence_penalty.max)
		.optional(),
	stop: z
		.union([z.string(), z.array(z.string()).max(PARAMETER_LIMITS.stop_sequences.max)])
		.optional(),
});

export type ChatMessageData = z.infer<typeof ChatMessageSchema>;
export type ChatCompletionData = z.infer<typeof ChatCompletionSchema>;

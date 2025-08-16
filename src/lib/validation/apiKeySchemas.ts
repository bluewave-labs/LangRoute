import { z } from 'zod';

/**
 * Schema for creating a new API key
 */
export const CreateApiKeySchema = z.object({
	name: z.string().min(1).max(100).optional(),
});

/**
 * Schema for deleting an API key
 */
export const ApiKeyIdParamSchema = z.object({
	id: z.uuid({ error: 'Invalid API key ID format' }),
});

export type CreateApiKeyData = z.infer<typeof CreateApiKeySchema>;
export type DeleteApiKeyData = z.infer<typeof ApiKeyIdParamSchema>;

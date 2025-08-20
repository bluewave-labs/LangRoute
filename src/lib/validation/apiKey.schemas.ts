// src/lib/validation/apiKeySchemas.ts
import { z } from 'zod';

export const CreateApiKeySchema = z.object({
	name: z.string().trim().min(1).max(100).optional(),
});

export const ApiKeyIdParamSchema = z.object({
	id: z.uuid({ error: 'Invalid API key ID format' }),
});

export type CreateApiKeyData = z.infer<typeof CreateApiKeySchema>;
export type ApiKeyIdParamData = z.infer<typeof ApiKeyIdParamSchema>;

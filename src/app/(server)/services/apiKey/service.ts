// src/app/(server)/services/apiKey/service.ts
import { Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

import prisma from '@/db/prisma';

import { ServiceError } from '@services';

/**
 * Data required to create a new API key.
 */
export interface CreateApiKeyData {
	userId: string;
	name?: string;
}

/**
 * Response shape for API key creation.
 */
export interface ApiKeyResponse {
	id: string;
	key: string;
	createdAt: Date;
	name?: string | null;
}

/**
 * Data required to delete an API key.
 */
export interface DeleteApiKeyData {
	apiKeyId: string;
	userId: string;
}

/**
 * Data required to update an API key.
 */
export interface UpdateApiKeyData {
	apiKeyId: string;
	userId: string;
	patch: UpdateApiKeyPatch;
}

/** PATCH input */
export interface UpdateApiKeyPatch {
	name?: string;
	revoked?: boolean;
	/** ISO string or null (to clear). */
	expiresAt?: string | null;
}

/** Internal: consistent key prefix + preview logic. */
const KEY_PREFIX = 'lr_';
/**
 * Generates a secure API key with a consistent prefix.
 *
 * @returns A newly generated API key string.
 */
function generateKey(): string {
	return KEY_PREFIX + randomBytes(32).toString('hex');
}

/**
 * Formats an API key for display by showing a preview (prefix and last 4 characters).
 *
 * @param key - The API key to format.
 * @returns A formatted string preview of the API key.
 */
function previewFromKey(key: string): string {
	const last4 = key.slice(-4);
	return `${KEY_PREFIX}…${last4}`;
}

/** Shape returned when we don’t want to expose the full key value again. */
export interface ApiKeySafe {
	id: string;
	name: string | null;
	revoked: boolean;
	expiresAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	preview: string; // e.g., lr_…abcd
}

/**
 * Converts a database row to a safe API key shape.
 *
 * @param row - The database row containing API key data.
 * @returns A safe API key shape with a preview.
 */
function toSafeShape(row: {
	id: string;
	key: string;
	name: string | null;
	revoked: boolean;
	expiresAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}): ApiKeySafe {
	return {
		id: row.id,
		name: row.name,
		revoked: row.revoked,
		expiresAt: row.expiresAt,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
		preview: previewFromKey(row.key),
	};
}

/**
 * API Key Service — business logic only.
 */
export const ApiKeyService = {
	/**
	 * Retrieves all API keys for a specific user.
	 *
	 * @param userId - The ID of the user whose API keys are to be retrieved.
	 * @returns An array of API key objects containing id, key, name, and creation date.
	 */
	async getUserApiKeys(userId: string): Promise<ApiKeyResponse[]> {
		const apiKeys = await prisma.apiKey.findMany({
			where: { userId },
			select: { id: true, key: true, createdAt: true, name: true },
			orderBy: { createdAt: 'desc' },
		});
		return apiKeys;
	},

	/**
	 * Creates a new API key for a user.
	 *
	 * @param data - The data required to create an API key, including user ID and optional name.
	 * @returns The created API key object.
	 */
	async createApiKey(data: CreateApiKeyData): Promise<ApiKeyResponse> {
		const { userId, name } = data;
		const key = generateKey();
		try {
			const apiKey = await prisma.apiKey.create({
				data: { key, userId, name },
				select: { id: true, key: true, createdAt: true, name: true },
			});
			return apiKey;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new ServiceError('API key already exists', 409);
			}
			throw error;
		}
	},

	/**
	 * Deletes an API key belonging to a specific user.
	 *
	 * @param data - The data required to delete an API key, including API key ID and user ID.
	 * @throws ServiceError if the API key does not exist or deletion fails.
	 */
	async deleteApiKey(data: DeleteApiKeyData): Promise<void> {
		const { apiKeyId, userId } = data;

		const apiKey = await prisma.apiKey.findFirst({
			where: { id: apiKeyId, userId },
			select: { id: true },
		});

		if (!apiKey) {
			throw new ServiceError('API key not found or access denied', 404);
		}

		await prisma.apiKey.delete({ where: { id: apiKeyId } });
	},

	/**
	 * Updates selected fields on an API key (name, revoked, expiresAt).
	 *
	 * @param data - The data required to update an API key, including API key ID, user ID, and patch data.
	 * @returns A safe shape (no full key exposure) with a preview.
	 */
	async updateApiKey({ apiKeyId, userId, patch }: UpdateApiKeyData): Promise<ApiKeySafe> {
		// Ownership check + get current row
		const existing = await prisma.apiKey.findFirst({
			where: { id: apiKeyId, userId },
			select: {
				id: true,
				key: true,
				name: true,
				revoked: true,
				expiresAt: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!existing) {
			throw new ServiceError('API key not found or access denied', 404);
		}

		// Build update payload (narrow carefully)
		const data: Record<string, unknown> = {};
		if (patch.name !== undefined) data.name = patch.name ?? null;
		if (patch.revoked !== undefined) data.revoked = Boolean(patch.revoked);

		const v = patch.expiresAt;
		if (v !== undefined) {
			if (v === null) {
				data.expiresAt = null; // clear
			} else {
				const d = new Date(v);
				if (Number.isNaN(d.getTime())) {
					throw new ServiceError('expiresAt must be an ISO-8601 date-time string or null', 400);
				}
				data.expiresAt = d;
			}
		}

		if (Object.keys(data).length === 0) {
			throw new ServiceError('No fields to update', 400);
		}

		const updated = await prisma.apiKey.update({
			where: { id: apiKeyId },
			data,
			select: {
				id: true,
				key: true,
				name: true,
				revoked: true,
				expiresAt: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return toSafeShape(updated);
	},

	/**
	 * Resolves user & key IDs from an access token.
	 *
	 * @param token - The API key token to resolve.
	 * @returns An object containing the user ID and key ID associated with the token.
	 */
	async getContextFromToken(token: string): Promise<{ userId: string; keyId: string }> {
		const rec = await prisma.apiKey.findUnique({
			where: { key: token },
			select: { id: true, userId: true, revoked: true, expiresAt: true },
		});

		if (!rec) throw new ServiceError('Unauthorized', 401);
		if (rec.revoked) throw new ServiceError('API key revoked', 401);
		if (rec.expiresAt && rec.expiresAt < new Date()) throw new ServiceError('API key expired', 401);

		return { userId: rec.userId, keyId: rec.id };
	},
};

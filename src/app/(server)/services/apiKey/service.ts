import { randomBytes } from 'crypto';

import prisma from '@/db/prisma';

import { ServiceError } from '@services';

export interface CreateApiKeyData {
	userId: string;
	name?: string;
}

export interface ApiKeyResponse {
	id: string;
	key: string;
	createdAt: Date;
	name?: string | null;
}

export interface DeleteApiKeyData {
	apiKeyId: string;
	userId: string;
}

/**
 * API Key Service
 * Handles all business logic related to API key management
 */
export const ApiKeyService = {
	/**
	 * Retrieves all API keys for a specific user
	 * @param userId - The user ID to fetch API keys for
	 * @returns Array of API key objects
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
	 * Creates a new API key for a user
	 * @param data - API key creation data
	 * @returns Created API key object
	 */
	async createApiKey(data: CreateApiKeyData): Promise<ApiKeyResponse> {
		const { userId, name } = data;

		// Generate a secure API key
		const key = this.generateApiKey();

		try {
			const apiKey = await prisma.apiKey.create({
				data: { key, userId, name },
				select: { id: true, key: true, createdAt: true, name: true },
			});

			return apiKey;
		} catch (error) {
			if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
				throw new ServiceError('API key already exists', 409);
			}
			throw error;
		}
	},

	/**
	 * Deletes an API key belonging to a specific user
	 * @param data - API key deletion data
	 * @returns void
	 * @throws ServiceError when API key is not found or doesn't belong to user
	 */
	async deleteApiKey(data: DeleteApiKeyData): Promise<void> {
		const { apiKeyId, userId } = data;

		// Verify the API key belongs to the user
		const apiKey = await prisma.apiKey.findFirst({
			where: { id: apiKeyId, userId },
		});

		if (!apiKey) {
			throw new ServiceError('API key not found or access denied', 404);
		}

		await prisma.apiKey.delete({ where: { id: apiKeyId } });
	},

	/**
	 * Retrieves user ID from API key token
	 * @param token - API key token
	 * @returns User ID
	 * @throws ServiceError when token is invalid
	 */
	async getUserIdFromToken(token: string): Promise<string> {
		const apiKey = await prisma.apiKey.findUnique({
			where: { key: token },
			select: { userId: true },
		});

		if (!apiKey) {
			throw new ServiceError('Invalid API key', 401);
		}

		return apiKey.userId;
	},

	/**
	 * Generates a secure API key with prefix
	 * @returns Generated API key string
	 */
	generateApiKey(): string {
		return 'lr_' + randomBytes(32).toString('hex');
	},
};

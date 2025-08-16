// src/app/(server)/services/chat/configService.ts
/**
 * Chat configuration service
 * Minimal facade over the chat registry (single source of truth).
 */
import {
	SUPPORTED_MODELS,
	SUPPORTED_MODEL_IDS,
	type SupportedModelId,
} from '@lib/config/llmConfig';
import type { ModelConfig } from '@lib/models/Chat';

import { ServiceError } from '../system/errorService';

export const ChatConfigService = {
	/**
	 * Return the list of supported model ids.
	 * Useful for admin UIs or diagnostics.
	 */
	getSupportedModelIds(): readonly SupportedModelId[] {
		return SUPPORTED_MODEL_IDS;
	},

	/**
	 * Validates the model id and returns its config.
	 * Throws ServiceError(400) for unknown ids.
	 */
	validateAndGetModel(modelId: string): ModelConfig {
		if (!SUPPORTED_MODEL_IDS.includes(modelId as SupportedModelId)) {
			throw new ServiceError(`Invalid model: ${modelId}`, 400);
		}
		const cfg = SUPPORTED_MODELS[modelId as SupportedModelId];
		return cfg;
	},

	/**
	 * Returns the max tokens limit for a model (after validation).
	 */
	getMaxTokens(modelId: string): number {
		return this.validateAndGetModel(modelId).maxTokens;
	},

	/**
	 * Ensures a model supports a given capability (e.g. "supportsStreaming").
	 * Throws ServiceError(400) if not supported.
	 */
	ensureFeature(
		modelId: string,
		feature: 'supportsStreaming' | 'supportsVision' | 'supportsFunctions',
	): void {
		const cfg = this.validateAndGetModel(modelId);
		if (!cfg[feature]) {
			const featureName = feature.replace('supports', '').toLowerCase();
			throw new ServiceError(`Model "${modelId}" does not support ${featureName}`, 400);
		}
	},
} as const;

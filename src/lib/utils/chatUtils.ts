// src/lib/utils/chatUtils.ts
/**
 * Minimal backend helpers over the chat registry.
 * Reads only from `lib/config/chat` to keep a single source of truth.
 */
import {
	SUPPORTED_MODELS,
	SUPPORTED_PROVIDERS,
	type SupportedModelId,
} from '@/lib/config/llmConfig';
import type { ModelConfig } from '@/lib/models/Chat';

/** Stable list of supported model IDs at runtime. */
export const SUPPORTED_MODEL_IDS = Object.keys(SUPPORTED_MODELS) as SupportedModelId[];

/** O(1) provider membership using a normalized Set. */
const PROVIDER_SET = new Set(SUPPORTED_PROVIDERS.map((p) => p.toLowerCase()));

/** Returns true if the provider appears in the registry. */
export function isProviderSupported(provider: string): boolean {
	return PROVIDER_SET.has(provider.toLowerCase());
}

/** Get model configuration by ID. */
export function getModelConfig(modelId: SupportedModelId): ModelConfig {
	return SUPPORTED_MODELS[modelId];
}

/** List models by provider (no FE formatting, no grouping). */
export function getModelsByProvider(provider: string): ModelConfig[] {
	const p = provider.toLowerCase();
	return SUPPORTED_MODEL_IDS.filter((id) => SUPPORTED_MODELS[id].provider.toLowerCase() === p).map(
		(id) => SUPPORTED_MODELS[id],
	);
}

/** Runtime guard for model IDs. */
export function isValidModelId(modelId: string): modelId is SupportedModelId {
	return (SUPPORTED_MODEL_IDS as readonly string[]).includes(modelId);
}

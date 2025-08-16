// src/lib/config/chat.ts
/**
 * Chat configuration registry (single source of truth).
 * - Backend-facing only (no UI colors/icons, no dropdown helpers).
 * - Other modules (schemas, utils, services) should read from here.
 */
import type { ModelConfig, RoleConfig } from '@lib/models/Chat';

/* ── Models registry ───────────────────────────────────────────────────── */

export const SUPPORTED_MODELS = {
	// OpenAI
	'gpt-4o': {
		id: 'gpt-4o',
		label: 'GPT-4o',
		provider: 'openai',
		description: 'Most advanced multimodal model with vision capabilities',
		contextWindow: 128000,
		maxTokens: 4096,
		supportsStreaming: true,
		supportsVision: true,
		supportsFunctions: true,
		pricing: { input: 5.0, output: 15.0 },
	},
	'gpt-4o-mini': {
		id: 'gpt-4o-mini',
		label: 'GPT-4o Mini',
		provider: 'openai',
		description: 'Fast and affordable multimodal model',
		contextWindow: 128000,
		maxTokens: 16384,
		supportsStreaming: true,
		supportsVision: true,
		supportsFunctions: true,
		pricing: { input: 0.15, output: 0.6 },
	},
	'gpt-4-turbo': {
		id: 'gpt-4-turbo',
		label: 'GPT-4 Turbo',
		provider: 'openai',
		description: 'Previous generation flagship model with large context',
		contextWindow: 128000,
		maxTokens: 4096,
		supportsStreaming: true,
		supportsVision: true,
		supportsFunctions: true,
		pricing: { input: 10.0, output: 30.0 },
	},
	'gpt-4': {
		id: 'gpt-4',
		label: 'GPT-4',
		provider: 'openai',
		description: 'Original GPT-4 model (legacy)',
		contextWindow: 8192,
		maxTokens: 4096,
		supportsStreaming: true,
		supportsFunctions: true,
		pricing: { input: 30.0, output: 60.0 },
		deprecated: true,
	},
	'gpt-3.5-turbo': {
		id: 'gpt-3.5-turbo',
		label: 'GPT-3.5 Turbo',
		provider: 'openai',
		description: 'Fast and efficient model for most tasks',
		contextWindow: 16385,
		maxTokens: 4096,
		supportsStreaming: true,
		supportsFunctions: true,
		pricing: { input: 0.5, output: 1.5 },
	},

	// Anthropic
	'claude-3-5-sonnet-20241022': {
		id: 'claude-3-5-sonnet-20241022',
		label: 'Claude 3.5 Sonnet',
		provider: 'anthropic',
		description: 'Latest Claude model with enhanced reasoning',
		contextWindow: 200000,
		maxTokens: 8192,
		supportsStreaming: true,
		supportsVision: true,
		pricing: { input: 3.0, output: 15.0 },
	},
	'claude-3-haiku-20240307': {
		id: 'claude-3-haiku-20240307',
		label: 'Claude 3 Haiku',
		provider: 'anthropic',
		description: 'Fastest and most affordable Claude model',
		contextWindow: 200000,
		maxTokens: 4096,
		supportsStreaming: true,
		supportsVision: true,
		pricing: { input: 0.25, output: 1.25 },
	},

	// Google
	'gemini-1.5-pro': {
		id: 'gemini-1.5-pro',
		label: 'Gemini 1.5 Pro',
		provider: 'google',
		description: 'Advanced multimodal model with huge context window',
		contextWindow: 2000000,
		maxTokens: 8192,
		supportsStreaming: true,
		supportsVision: true,
		supportsFunctions: true,
		pricing: { input: 3.5, output: 10.5 },
	},
	'gemini-1.5-flash': {
		id: 'gemini-1.5-flash',
		label: 'Gemini 1.5 Flash',
		provider: 'google',
		description: 'Fast and efficient model with large context',
		contextWindow: 1000000,
		maxTokens: 8192,
		supportsStreaming: true,
		supportsVision: true,
		supportsFunctions: true,
		pricing: { input: 0.075, output: 0.3 },
	},
	'gemini-pro': {
		id: 'gemini-pro',
		label: 'Gemini Pro',
		provider: 'google',
		description: 'Previous generation Gemini model',
		contextWindow: 32768,
		maxTokens: 8192,
		supportsStreaming: true,
		supportsFunctions: true,
		pricing: { input: 0.5, output: 1.5 },
		deprecated: true,
	},
} as const satisfies Record<string, ModelConfig>;

export type SupportedModelId = keyof typeof SUPPORTED_MODELS;
export const SUPPORTED_MODEL_IDS = Object.keys(SUPPORTED_MODELS) as SupportedModelId[];

/* ── Providers (derived from registry) ─────────────────────────────────── */

const _PROVIDERS = Array.from(
	new Set(Object.values(SUPPORTED_MODELS).map((m) => m.provider.toLowerCase())),
).sort();

/**
 * Runtime list of supported provider ids, derived from SUPPORTED_MODELS.
 * Example: ["anthropic","google","openai"]
 */
export const SUPPORTED_PROVIDERS = _PROVIDERS as ReadonlyArray<string>;

/* ── Roles (backend only; no UI properties) ───────────────────────────── */

export const ROLE_IDS = ['system', 'user', 'assistant'] as const;
export type ChatRole = (typeof ROLE_IDS)[number];

export const CHAT_ROLES: Record<ChatRole, RoleConfig> = {
	system: { id: 'system', label: 'System', description: 'System instructions and context' },
	user: { id: 'user', label: 'User', description: 'User messages and queries' },
	assistant: { id: 'assistant', label: 'Assistant', description: 'AI assistant responses' },
} as const;

/* ── Global parameter bounds (generic; model-specific checks go in services) ─ */

export const PARAMETER_LIMITS = {
	temperature: { min: 0, max: 2, default: 1, step: 0.1 },
	top_p: { min: 0, max: 1, default: 1, step: 0.01 },
	frequency_penalty: { min: -2, max: 2, default: 0, step: 0.1 },
	presence_penalty: { min: -2, max: 2, default: 0, step: 0.1 },
	max_tokens: { min: 1, max: 4096, default: 1000, step: 1 },
	stop_sequences: { max: 4 },
} as const;

/**
 * Chat domain models and interfaces
 * Core business entities for chat functionality
 */

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * Model configuration interface
 * Defines the structure for AI model metadata
 */
export interface ModelConfig {
	id: string;
	label: string;
	provider: 'openai' | 'anthropic' | 'google' | (string & {}); // allow extension
	description: string;
	contextWindow: number;
	maxTokens: number;
	supportsStreaming: boolean;
	supportsVision?: boolean;
	supportsFunctions?: boolean;
	pricing: {
		input: number; // per 1K tokens
		output: number; // per 1K tokens
	};
	deprecated?: boolean;
}

/**
 * Role configuration interface
 * Defines the structure for chat role metadata
 */
export interface RoleConfig {
	id: 'system' | 'user' | 'assistant' | (string & {}); // extensible
	label: string;
	description: string;
}

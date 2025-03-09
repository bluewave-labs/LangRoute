/**
 * @fileoverview Utility functions for LangRoute.
 * 
 * This module provides various utility functions used throughout the application
 * for common operations like model name parsing and standardization.
 * 
 * @module utils
 */

/**
 * Extracts the base model name from a fully qualified model identifier.
 * 
 * For example:
 * - 'gpt-3.5-turbo' -> 'gpt'
 * - 'mistral-small' -> 'mistral'
 * - 'claude-2' -> 'claude'
 * 
 * This is used to standardize model names across different providers
 * and versions for consistent handling in the application.
 * 
 * @param {string} modelName - The full model identifier
 * @returns {string} The base model name
 * @example
 * getModel('gpt-3.5-turbo') // returns 'gpt'
 * getModel('mistral-small') // returns 'mistral'
 */
function getModel(modelName) {
    const baseModelName = modelName.split('-')[0];
    return baseModelName;
}

module.exports = { getModel };

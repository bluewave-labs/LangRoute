/**
 * @fileoverview Provider model for LLM service configuration.
 * 
 * This model manages the configuration for different LLM providers
 * supported by LangRoute. It stores essential information like API
 * endpoints and version information for each provider.
 * 
 * Currently supported providers (there can be more providers in the future):
 * - OpenAI: GPT models
 * - Mistral: Mistral models
 * 
 * Each provider entry contains:
 * - Base API URL
 * - API version
 * - Provider-specific configuration
 * 
 * @module models/provider
 * @requires sequelize
 */

'use strict';

/**
 * Initializes the Provider model.
 * 
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DataTypes} DataTypes - Sequelize data types
 * @returns {Model} Initialized Provider model
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * Provider model definition.
   * Stores configuration for LLM service providers.
   * 
   * @type {Model}
   */
  const Provider = sequelize.define('Provider', {
    /** @type {string} Unique identifier for the provider (e.g., 'openai', 'mistral') */
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    /** @type {string} Base URL for the provider's API (e.g., 'https://api.openai.com') */
    apiBase: {
      type: DataTypes.STRING,
      allowNull: false
    },
    /** @type {string} API version identifier (e.g., 'v1' for OpenAI) */
    apiVersion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Providers',
    timestamps: false
  });

  return Provider;
};

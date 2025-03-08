/**
 * @fileoverview APILog model for tracking LLM API requests.
 * 
 * This model stores detailed information about each API request made through LangRoute,
 * including request/response data, token usage, costs, and timestamps. It provides
 * the foundation for the real-time logs viewer and usage analytics.
 * 
 * Features tracked:
 * - Request and response details
 * - Token usage (input/output)
 * - Cost breakdown
 * - Model and provider information
 * - Timestamps and request duration
 * 
 * @module models/apilog
 * @requires sequelize
 */

'use strict';

/**
 * Initializes the APILog model.
 * 
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DataTypes} DataTypes - Sequelize data types
 * @returns {Model} Initialized APILog model
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * APILog model definition.
   * Tracks detailed information about each LLM API request.
   * 
   * @type {Model}
   */
  const APILog = sequelize.define('APILog', {
    /** @type {UUID} Unique identifier for the log entry */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    /** @type {string} Virtual key of the user who made the request */
    virtualKey: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'virtualKey'
      }
    },
    /** @type {string} Unique identifier for the request */
    requestId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    /** @type {string} LLM model used (e.g., 'gpt-3.5-turbo', 'mistral-small') */
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    /** @type {string} LLM provider (e.g., 'openai', 'mistral') */
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    /** @type {number} Number of tokens in the input/prompt */
    inputTokens: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    /** @type {number} Number of tokens in the model's response */
    outputTokens: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    /** @type {number} Cost for input tokens in USD */
    inputCost: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    /** @type {number} Cost for output tokens in USD */
    outputCost: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    /** @type {number} Total cost of the request in USD */
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    /** @type {Object} Complete request data including headers and body */
    request: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    /** @type {Object} Complete response data including status and body */
    response: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    tableName: 'APILogs'
  });

  /**
   * Sets up model associations.
   * Each APILog belongs to a User through the virtualKey.
   * 
   * @param {Object} models - The models object containing all models
   */
  APILog.associate = function(models) {
    APILog.belongsTo(models.User, {
      foreignKey: 'virtualKey',
      targetKey: 'virtualKey'
    });
  };

  return APILog;
};

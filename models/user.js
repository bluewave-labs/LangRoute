/**
 * @fileoverview User model for LangRoute authentication and rate limiting.
 * 
 * This model manages user accounts, API key storage, and usage limits.
 * It includes secure encryption for provider API keys and configurable
 * rate limits for both request counts and token usage.
 * 
 * Security features:
 * - AES-256-CBC encryption for API keys
 * - Virtual key authentication
 * - Configurable rate limits
 * - Usage tracking
 * 
 * Environment variables required:
 * - ENCRYPTION_KEY: 32-byte hex key for AES encryption
 * - IV: 16-byte hex initialization vector
 * 
 * @module models/user
 * @requires crypto
 * @requires sequelize
 */

'use strict';

const crypto = require('crypto');

/**
 * Initializes the User model.
 * 
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DataTypes} DataTypes - Sequelize data types
 * @returns {Model} Initialized User model
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * User model definition.
   * Manages user authentication, API keys, and usage limits.
   * 
   * @type {Model}
   */
  const User = sequelize.define('User', {
    /** @type {string} Unique identifier for authentication, used instead of user ID */
    virtualKey: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    /** @type {string} Encrypted OpenAI API key */
    openaiKey: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    /** @type {string} Encrypted Mistral API key */
    mistralKey: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    /** @type {number} Maximum number of API requests allowed per minute */
    requestsPerMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60
    },
    /** @type {number} Maximum number of tokens allowed per minute */
    tokensPerMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100000
    },
    /** @type {number} Total accumulated cost in USD from all API requests */
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'Users',
    timestamps: false
  });

  /**
   * Encrypts an API key using AES-256-CBC.
   * Uses environment variables for encryption key and IV.
   * 
   * @param {string} key - The API key to encrypt
   * @returns {string} Encrypted key in hex format
   */
  User.prototype.encryptKey = function(key) {
    if (!key) return '';
    // Convert hex strings to buffers
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY.replace(/"/g, ''), 'hex');
    const iv = Buffer.from(process.env.IV.replace(/"/g, ''), 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(key, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  };

  /**
   * Decrypts an encrypted API key using AES-256-CBC.
   * Uses environment variables for encryption key and IV.
   * 
   * @param {string} encryptedKey - The encrypted API key in hex format
   * @returns {string} Decrypted API key
   */
  User.prototype.decryptKey = function(encryptedKey) {
    if (!encryptedKey) return '';
    // Convert hex strings to buffers
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY.replace(/"/g, ''), 'hex');
    const iv = Buffer.from(process.env.IV.replace(/"/g, ''), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  return User;
};

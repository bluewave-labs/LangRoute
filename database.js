/**
 * @fileoverview Database connection module for LangRoute.
 * 
 * This module initializes and manages the PostgreSQL database connection using Sequelize ORM.
 * It serves as the central point for database access, providing access to all models:
 * 
 * Models available:
 * - User: Manages user accounts and API keys
 * - Provider: Stores LLM provider configurations
 * - LLMModel: Stores model configurations and pricing
 * - APILog: Tracks API requests and their metrics
 * 
 * The module automatically tests the database connection on startup and
 * provides proper error handling for connection issues.
 * 
 * Environment variables required:
 * - DATABASE_URL: PostgreSQL connection string
 * 
 * @module database
 * @requires ./models
 */

const db = require('./models/index');

/** @type {Object} The database instance containing all models and the Sequelize connection */

/**
 * Tests the connection to the PostgreSQL database.
 * This is automatically executed when the module is loaded.
 * 
 * Connection states:
 * - Success: Logs a confirmation message
 * - Failure: Logs detailed error information but allows the application to continue
 * 
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Logs but doesn't throw database connection errors
 */
db.sequelize.authenticate() // Use authenticate() for Sequelize
  .then(() => {
    console.log('Connected to PostgreSQL via Sequelize');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });
module.exports = db;


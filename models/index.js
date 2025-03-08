/**
 * @fileoverview Sequelize models initialization and registration module.
 * 
 * This module serves as the central registry for all database models in the application.
 * It automatically discovers and loads all model files in the models directory,
 * establishes database connections, and sets up model associations.
 * 
 * Models loaded:
 * - User: User accounts and API keys
 * - Provider: LLM provider configurations
 * - LLMModel: Model configurations and pricing
 * - APILog: Request tracking and metrics
 * 
 * Environment variables:
 * - NODE_ENV: Runtime environment (development/production)
 * - DATABASE_URL: Database connection string (if using env variable)
 * 
 * @module models/index
 * @requires fs
 * @requires path
 * @requires sequelize
 * @requires process
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../config/config.json'))[env];

/** @type {Object} Database object containing all models and Sequelize instance */
const db = {};

/** @type {Sequelize} Sequelize instance for database connection */
let sequelize;

// Initialize Sequelize with either environment variable or direct configuration
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Automatically discover and load all model definitions
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&      // Ignore dot files
      file !== basename &&            // Ignore this file
      file.slice(-3) === '.js' &&     // Only include .js files
      file.indexOf('.test.js') === -1 // Ignore test files
    );
  })
  .forEach(file => {
    // Initialize model and add it to the db object
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up model associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach the Sequelize instance and class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/** @exports db */
module.exports = db;

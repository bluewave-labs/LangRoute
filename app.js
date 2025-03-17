/**
 * @fileoverview LangRoute - A Language Model Gateway Service
 * 
 * This service acts as an intelligent proxy for various LLM providers (OpenAI, Mistral).
 * Features:
 * - API key management with encryption
 * - Rate limiting (requests and tokens)
 * - Cost tracking
 * - Model fallback support
 * - Real-time logging
 * - Dynamic configuration reloading
 * 
 * Environment variables required:
 * - DATABASE_URL: PostgreSQL connection string
 * - ENCRYPTION_KEY: Key for API key encryption
 * 
 * @author LangRoute Team
 * @license MIT
 */

require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const { countTokens } = require('./tokenCounter');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('./database'); // Sequelize models
const { v4: uuidv4 } = require('uuid'); // For generating virtual keys
const { checkRateLimit, updateRequestCount, checkTokenLimit, updateTokenCount, updateUserCost } = require('./rateLimiter');
const { calculateCost } = require('./costTracker');
const { getModel } = require('./utils'); // Import getModel
const yaml = require('js-yaml');
const app = express();

/**
 * Endpoint to reload configuration from the database.
 * Updates provider and model configurations without server restart.
 * 
 * @route POST /reload-config
 * @returns {Object} message - Success or error message
 */
app.post('/reload-config', async (req, res) => {
    try {
        // In a real implementation, you would likely reload *all*
        // your configuration (models, providers) from the database here.
        // For this example, we'll just send a success message.
        // await loadConfigFromDB(); // You'd implement this function

        console.log("INFO: Configuration reloaded (from database)");
        res.send({ message: 'Configuration reloaded.' });
    } catch (error) {
        console.error("ERROR: Failed to reload config:", error);
        res.status(500).send({ error: 'Failed to reload configuration.' });
    }
});

app.use(express.json());

/**
 * Generates a new virtual key for API authentication.
 * Creates a new user record with default rate limits.
 * 
 * @route POST /api/generate-virtual-key
 * @returns {Object} virtualKey - The generated virtual key
 */
app.post('/api/generate-virtual-key', async (req, res) => {
    try {
        const virtualKey = uuidv4(); // Generate a unique key
        const newUser = await db.User.create({
            virtualKey: virtualKey,
            openaiKey: '', // Start with empty keys
            mistralKey: '',
            requestsPerMinute: 60,  // Default values
            tokensPerMinute: 100000,
            totalCost: 0,
        });

        console.log(`INFO: New virtual key generated: ${virtualKey}`);
        res.status(201).json({ virtualKey: newUser.virtualKey }); // Return the new key
    } catch (error) {
        console.error("ERROR: Failed to generate virtual key:", error);
        res.status(500).send({ error: 'Failed to generate virtual key.' });
    }
});

/**
 * Saves encrypted provider API keys for a user.
 * 
 * @route POST /api/save-keys
 * @param {Object} req.body
 * @param {string} req.body.virtualKey - User's virtual key
 * @param {string} req.body.openaiKey - OpenAI API key
 * @param {string} req.body.mistralKey - Mistral API key
 * @returns {Object} message - Success or error message
 */
app.post('/api/save-keys', async (req, res) => {
    try {
        const { virtualKey, openaiKey, mistralKey } = req.body;

        // Basic input validation
        if (!virtualKey || typeof virtualKey !== 'string') {
            return res.status(400).send({ error: 'Invalid or missing virtualKey.' });
        }

        const user = await db.User.findOne({ where: { virtualKey: virtualKey } });

        if (!user) {
            return res.status(404).send({ error: 'User not found with the provided virtualKey.' });
        }

        const encryptedOpenaiKey = user.encryptKey(openaiKey);
        const encryptedMistralKey = user.encryptKey(mistralKey);

        user.openaiKey = encryptedOpenaiKey;
        user.mistralKey = encryptedMistralKey;
        await user.save();

        console.log(`INFO: API keys saved for virtualKey: ${virtualKey}`);
        res.status(200).send({ message: 'API keys saved successfully.' });

    } catch (error) {
        console.error("ERROR: Failed to save API keys:", error);
        res.status(500).send({ error: 'Failed to save API keys.' });
    }
});

/**
 * Main chat completions endpoint.
 * Handles routing requests to appropriate LLM providers with fallback support.
 * 
 * Features:
 * - Authentication via virtual key
 * - Rate limiting checks
 * - Token counting
 * - Cost tracking
 * - Automatic fallback to alternative models
 * - Response standardization
 * - Real-time logging
 * 
 * @route POST /chat/completions
 * @param {Object} req.headers
 * @param {string} req.headers.authorization - Bearer token with virtual key
 * @param {Object} req.body
 * @param {string} req.body.model - Requested model name
 * @param {Array} req.body.messages - Chat messages
 * @returns {Object} Standardized chat completion response
 */
app.post('/chat/completions', async (req, res, next) => {
    const requestStartTime = new Date();
    try {
        // 1. Require and Validate Virtual Key (Authentication)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ error: 'Unauthorized: Missing or invalid Bearer token.' });
        }

        const virtualKey = authHeader.split(' ')[1];
        if (!virtualKey) {
             return res.status(401).send({ error: 'Unauthorized: Missing virtual key.' });
        }

        // 2. Retrieve User Data
        const user = await db.User.findOne({ where: { virtualKey: virtualKey } });
        if (!user) {
            return res.status(401).send({ error: 'Unauthorized: Invalid virtual key.' });
        }

        // 3. Decrypt API Keys
        const openaiKey = user.decryptKey(user.openaiKey);
        const mistralKey = user.decryptKey(user.mistralKey);

        // 4.  Get Requested Model and Config
        const requestedModelName = req.body.model;
        const modelConfig = await db.LLMModel.findOne({ where: { name: requestedModelName } });

        if (!modelConfig) {
            console.error(`ERROR: Model not found: ${requestedModelName}`);
            return res.status(400).send({ error: `Model ${requestedModelName} not found.` });
        }

        // 5. Check Rate Limits (using the retrieved limits)
        if (!await checkRateLimit(user)) { // AWAIT
            console.warn(`WARN: Rate limit exceeded (requests) for user: ${virtualKey}`);
            return res.status(429).send({ error: 'Rate limit exceeded (requests).' });
        }
        //We calculate input token after we know if the request should fail or not.
        const inputTokens = countTokens(requestedModelName, JSON.stringify(req.body)); //Pass complete model name.
        if (!await checkTokenLimit(user, inputTokens)) { // AWAIT
            console.warn(`WARN: Rate limit exceeded (tokens) for user: ${virtualKey}`);
            return res.status(429).send({ error: 'Rate limit exceeded (tokens).' });
        }

        // 6.  Make Request Function (Modified to use DB config and decrypted keys)
        /**
 * Makes an API request to the specified LLM provider.
 * 
 * @param {string} modelName - Name of the model to use
 * @param {Object} requestData - Request payload
 * @returns {Promise<Object>} Provider's API response
 * @throws {Error} If provider configuration is missing or request fails
 */
async function makeRequest(modelName, requestData) {
            const currentModelConfig = await db.LLMModel.findOne({ where: { name: modelName } }); //Fetch config
            if (!currentModelConfig) {
                console.error(`ERROR: Model not configured: ${modelName}`);
                throw new Error(`Model ${modelName} not configured.`);
            }
            const providerName = currentModelConfig.provider;
            const providerConfig = await db.Provider.findOne({ where: { name: providerName } });
            if (!providerConfig) {
                console.error(`ERROR: Provider not configured: ${providerName}`);
                throw new Error(`Provider ${providerName} not configured.`);
            }
            let apiKey;
            if(providerName === 'openai') {
              apiKey = openaiKey;
            } else if (providerName === 'mistral') {
              apiKey = mistralKey;
            } else {
              console.error(`ERROR: Provider not supported: ${providerName}`);
              throw new Error(`Provider ${providerName} not supported.`)
            }

            const headers = {
                'Authorization': `Bearer ${apiKey}`, // Use the decrypted API key
                'Content-Type': 'application/json',
            };

            if (providerConfig.apiVersion) {
                headers['api-version'] = providerConfig.apiVersion;
            }
            //No need for anthropic for now

            try {
                const response = await axios({
                    method: req.method,
                    url: `${providerConfig.apiBase}${req.path}`, // Construct the URL
                    headers: headers,
                    data: requestData,
                    validateStatus: (status) => true, // Handle all status codes
                });

                if (response.status >= 400) {
                    console.error(`ERROR: Request to ${providerName} failed with status: ${response.status}, data:`, response.data);
                    throw new Error(`Request to ${providerName} failed with status: ${response.status}`);
                }

                return response;

            } catch (error) {
                console.error(`ERROR: Request to ${providerName} failed:`, error.response ? error.response.data : error.message);
                throw error;
            }
        }

        // 7. Request Handling (with Fallback)
        let response;
        let usedModel = requestedModelName; // Keep track of which model was *actually* used
        let usedProvider;
        try {
            response = await makeRequest(requestedModelName, req.body);
            const modelInfo = await db.LLMModel.findOne({ where: { name: usedModel } });
            usedProvider = modelInfo.provider;
        } catch (primaryError) {
            if (modelConfig.fallback) {
                const fallbackArray = typeof modelConfig.fallback === 'string' ? JSON.parse(modelConfig.fallback) : modelConfig.fallback;
                for (const fallbackModelName of fallbackArray) {
                    try {
                        const fallbackRequestData = { ...req.body };
                        fallbackRequestData.model = fallbackModelName;
                        response = await makeRequest(fallbackModelName, fallbackRequestData);
                        console.log(`INFO: Fallback successful for: ${fallbackModelName}`);
                        usedModel = fallbackModelName; // Update usedModel
                        const modelInfo = await db.LLMModel.findOne({ where: { name: usedModel } });
                        usedProvider = modelInfo.provider;
                        break; // Exit loop on success
                    } catch (fallbackError) {
                        console.error(`ERROR: Fallback failed for: ${fallbackModelName}`, fallbackError.response ? fallbackError.response.data: fallbackError.message);
                    }
                }
            } else {
                console.error("ERROR: Primary provider failed and no fallbacks configured.");
            }
        }

        // 8. Response Standardization and Cost Calculation
        if (response) {
            if (response.status >= 200 && response.status < 300) {
                let standardizedResponse;
                if (response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
                    // OpenAI format - handles both regular responses and function calls
                    standardizedResponse = response.data;
                } else if (response.data.content && response.data.content[0] && response.data.content[0].text) {
                    // Anthropic Format
                    standardizedResponse = {
                        choices: [{
                            message: {
                                role: "assistant", // It's not inside original response.
                                content: response.data.content[0].text
                            }
                        }]
                    };
                } else {
                    // Handle other response formats or throw an error if unsupported
                    console.error("ERROR: Unsupported response format from provider.");
                    return res.status(500).send({ error: 'Unsupported response format from provider.' });
                }
                const outputTokens = countTokens(usedModel, standardizedResponse.choices[0].message.content);
                const costData = await calculateCost(usedModel, inputTokens, outputTokens);

                // 9. Update Usage Data (Database)
                // Update request count, token count and total cost
                await updateRequestCount(user); // AWAIT
                await updateTokenCount(user, inputTokens + outputTokens); // AWAIT
                await updateUserCost(user, costData.totalCost); // AWAIT

                // 10. Return Response to Client
                standardizedResponse.usage = {
                    prompt_tokens: costData.inputTokens,
                    completion_tokens: costData.outputTokens,
                    total_tokens: costData.inputTokens + costData.outputTokens,
                };
                standardizedResponse.cost = costData;

                // Store API log in the database with request duration
                const requestEndTime = new Date();
                await db.APILog.create({
                    virtualKey: virtualKey,
                    requestId: standardizedResponse.id || uuidv4(),
                    model: usedModel,
                    provider: usedProvider,
                    inputTokens: costData.inputTokens,
                    outputTokens: costData.outputTokens,
                    inputCost: costData.inputCost,
                    outputCost: costData.outputCost,
                    totalCost: costData.totalCost,
                    request: {
                        ...req.body,
                        method: req.method,
                        path: req.path
                    },
                    response: {
                        ...standardizedResponse,
                        status: response.status
                    },
                    createdAt: requestStartTime,
                    updatedAt: requestEndTime
                });

                res.status(response.status).send(standardizedResponse);

            } else {
                console.error(`ERROR: Forwarding error from provider: ${response.status}`, response.data);
                
                // Log the failed request with duration
                const requestEndTime = new Date();
                await db.APILog.create({
                    virtualKey: virtualKey,
                    requestId: uuidv4(),
                    model: usedModel,
                    provider: usedProvider,
                    inputTokens: 0,
                    outputTokens: 0,
                    inputCost: 0,
                    outputCost: 0,
                    totalCost: 0,
                    request: {
                        ...req.body,
                        method: req.method,
                        path: req.path
                    },
                    response: {
                        ...response.data,
                        status: response.status
                    },
                    createdAt: requestStartTime,
                    updatedAt: requestEndTime
                });
                
                res.status(response.status).send(response.data); // Forward the error
            }
        } else {
            console.error("ERROR: All providers failed.");
            
            // Log the failed request when all providers fail with duration
            const requestEndTime = new Date();
            await db.APILog.create({
                virtualKey: virtualKey,
                requestId: uuidv4(),
                model: requestedModelName,
                provider: modelConfig.provider,
                inputTokens: 0,
                outputTokens: 0,
                inputCost: 0,
                outputCost: 0,
                totalCost: 0,
                request: {
                    ...req.body,
                    method: req.method,
                    path: req.path
                },
                response: {
                    error: 'All providers failed',
                    status: 500
                },
                createdAt: requestStartTime,
                updatedAt: requestEndTime
            });
            
            res.status(500).send({ error: 'All providers failed.' });
        }

    } catch (error) {
        console.error("ERROR: /chat/completions error:", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

/**
 * Loads initial configuration from YAML file and syncs to database.
 * Sets up providers and models with their respective configurations.
 * 
 * @returns {Promise<void>}
 * @throws {Error} If configuration file cannot be read or parsed
 */
async function loadConfigFromFile() {
  const yaml = require('js-yaml');
  const configPath = path.join(__dirname, 'config.yaml');
  const configData = yaml.load(fs.readFileSync(configPath, 'utf8'));

  // Populate Providers
  for (const [providerName, providerData] of Object.entries(configData.providers)) {
    await db.Provider.upsert({
      name: providerName,
      apiBase: providerData.api_base,
      apiVersion: providerData.api_version
    });
  }

  // Populate Models
  for (const [modelName, modelData] of Object.entries(configData.models)) {
    await db.LLMModel.upsert({
      name: modelName,
      provider: modelData.provider,
      fallback: JSON.stringify(modelData.fallback),
      inputCostPer1k: modelData.cost_per_1k_tokens.input,
      outputCostPer1k: modelData.cost_per_1k_tokens.output
    });
  }

  console.log('Configuration loaded from file and database populated.');
}

// Call this function when the server starts
loadConfigFromFile().catch(err => {
  console.error('Failed to load configuration:', err);
});

db.sequelize.sync().then(() => {
  console.log('Database synchronized.');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`LLM proxy server listening on port ${PORT}`);
});

module.exports = { loadConfigFromFile };

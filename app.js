// app.js
const express = require('express');
const proxy = require('express-http-proxy');
const { countTokens } = require('./tokenCounter');
const axios = require('axios');
const db = require('./database'); // Sequelize models
const { v4: uuidv4 } = require('uuid'); // For generating virtual keys
const { checkRateLimit, updateRequestCount, checkTokenLimit, updateTokenCount, updateUserCost } = require('./rateLimiter');
const { calculateCost } = require('./costTracker');
const { getModel } = require('./utils'); // Import getModel
const app = express();

// Reload configuration (modified to load from DB)
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

// New endpoint: Generate Virtual Key
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

// New endpoint: Save API Keys
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

app.post('/chat/completions', async (req, res, next) => {
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
        try {
            response = await makeRequest(requestedModelName, req.body);
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
                if (response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content) {
                    //Already OpenAI format.
                    standardizedResponse = response.data;
                } else if (response.data.content && response.data.content[0] && response.data.content[0].text) {
                    //Anthropic Format
                    standardizedResponse = {
                        choices: [{
                            message: {
                                role: "assistant", //It's not inside original response.
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
                res.status(response.status).send(standardizedResponse);

            } else {
                console.error(`ERROR: Forwarding error from provider: ${response.status}`, response.data);
                res.status(response.status).send(response.data); // Forward the error
            }
        } else {
            console.error("ERROR: All providers failed.");
            res.status(500).send({ error: 'All providers failed.' });
        }

    } catch (error) {
        console.error("ERROR: /chat/completions error:", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`LLM proxy server listening on port ${PORT}`);
});

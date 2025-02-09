//tokenCounter.js
function countTokens(modelName, text) {
    //Use exact model name for Mistral.
    if (modelName === 'mistral-tiny' || modelName === 'mistral-small' || modelName === 'mistral-medium' || modelName === 'mistral-large') {
        return Math.ceil(text.length / 4);
    }
    try {
        // Get the correct encoding for the model
        const { encoding_for_model } = require('@dqbd/tiktoken');
        const encoding = encoding_for_model(modelName);
        const tokens = encoding.encode(text);
        encoding.free();
        return tokens.length;
      } catch (error) {
        console.error(`Error counting tokens for model ${modelName}:`, error);
        // Handle the error, perhaps by returning a default or estimated value
        return 0; // or throw error;
      }
}

module.exports = { countTokens };

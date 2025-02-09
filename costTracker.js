// costTracker.js
const { countTokens } = require('./tokenCounter');
const db = require('./database'); // Import Sequelize models

async function calculateCost(modelName, inputTokens, outputTokens) {
    const modelConfig = await db.LLMModel.findOne({ where: { name: modelName } }); //Use complete model name
    if (!modelConfig) {
        throw new Error(`Model ${modelName} not found in database.`);
    }
    const inputCost = (inputTokens / 1000) * modelConfig.inputCostPer1k;
    const outputCost = (outputTokens / 1000) * modelConfig.outputCostPer1k;

    return {
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
    };
}
async function updateUserCost(user, cost) {
  user.totalCost += cost;
  await user.save();
}
module.exports = { calculateCost, updateUserCost};

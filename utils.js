// utils.js
function getModel(modelName) {
    const baseModelName = modelName.split('-')[0];
    return baseModelName;
}

module.exports = { getModel };

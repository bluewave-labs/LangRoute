module.exports = (sequelize, DataTypes) => {
  const LLMModel = sequelize.define('LLMModel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fallback: {
      type: DataTypes.JSON,
      allowNull: true
    },
    inputCostPer1k: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    outputCostPer1k: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  // Define any associations here
  LLMModel.associate = function(models) {
    // associations can be defined here
  };

  return LLMModel;
};

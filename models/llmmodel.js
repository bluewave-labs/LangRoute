'use strict';

module.exports = (sequelize, DataTypes) => {
  const LLMModel = sequelize.define('LLMModel', {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Providers',
        key: 'name'
      }
    },
    fallback: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('fallback');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('fallback', JSON.stringify(value));
      }
    },
    inputCostPer1k: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    outputCostPer1k: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'LLMModels',
    timestamps: false
  });

  return LLMModel;
};

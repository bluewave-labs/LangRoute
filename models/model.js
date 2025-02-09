// models/model.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LLMModel extends Model { // Use a different class name to avoid conflict
    static associate(models) {
      // define association here
    }
  }
  LLMModel.init({  // Use the different class name here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fallback: { // Store as JSON string for simplicity
      type: DataTypes.STRING, // Change the type to STRING.
      allowNull: true, // Can be null (no fallback)
      get() { // Add a getter to parse the JSON
        const rawValue = this.getDataValue('fallback');
        return rawValue ? JSON.parse(rawValue) : []; // Parse the JSON and avoid errors.
        },
      set(value) { // Add a setter to stringify to JSON
        this.setDataValue('fallback', JSON.stringify(value)); //stringify.
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
    sequelize,
    modelName: 'LLMModel', // Use the different class name
    tableName: 'Models', // Specify the table name explicitly
  });
  return LLMModel; // Return the correct class
};

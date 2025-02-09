// models/provider.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Provider.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      apiBase: {
        type: DataTypes.STRING,
        allowNull: false
      },
      apiVersion: {
        type: DataTypes.STRING,
        allowNull: true
      }
  }, {
    sequelize,
    modelName: 'Provider',
    tableName: 'Providers'
  });
  return Provider;
};

// models/user.js
'use strict';
const { Model } = require('sequelize');
const crypto = require('crypto'); // For encryption

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    virtualKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    openaiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mistralKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestsPerMinute: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    },
    tokensPerMinute: {
      type: DataTypes.INTEGER,
      defaultValue: 100000
    },
    totalCost: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });

  // Encryption Method (CORRECTED to use Buffer for key)
  User.prototype.encryptKey = function(key) {
      if (!key) return '';
      const ivBuffer = Buffer.from(process.env.IV, 'hex');
      const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Convert key to Buffer
      const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer); // Use keyBuffer
      let encrypted = cipher.update(key, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
  };

  // Decryption Method (CORRECTED to use Buffer for key)
  User.prototype.decryptKey = function(encryptedKey) {
      if (!encryptedKey) return '';
      const ivBuffer = Buffer.from(process.env.IV, 'hex');
      const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Convert key to Buffer
      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer); // Use keyBuffer
      let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
  };

  return User;
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      virtualKey: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      openaiKey: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      mistralKey: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      requestsPerMinute: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60
      },
      tokensPerMinute: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100000
      },
      totalCost: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};

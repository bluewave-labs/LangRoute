'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LLMModels', {
      name: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Providers',
          key: 'name'
        }
      },
      fallback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      inputCostPer1k: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      outputCostPer1k: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LLMModels');
  }
};

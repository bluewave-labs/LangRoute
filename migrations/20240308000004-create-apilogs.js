'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('APILogs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      virtualKey: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'virtualKey'
        }
      },
      requestId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false
      },
      inputTokens: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      outputTokens: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      inputCost: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      outputCost: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      totalCost: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      request: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      response: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('APILogs');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Providers', {
      name: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      apiBase: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apiVersion: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Providers');
  }
};

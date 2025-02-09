// migrations/{timestamp}-create-user.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', { // Use 'Users' (plural)
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      virtualKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      openaiKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mistralKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestsPerMinute: {
        type: Sequelize.INTEGER,
        defaultValue: 60,
      },
      tokensPerMinute: {
        type: Sequelize.INTEGER,
        defaultValue: 100000,
      },
      totalCost: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users'); // Use 'Users' (plural)
  }
};

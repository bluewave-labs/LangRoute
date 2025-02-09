// migrations/{timestamp}-create-model.js

'use strict';

module.exports = {
 async up(queryInterface, Sequelize) {
   await queryInterface.createTable('Models', {
     id: {
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: Sequelize.INTEGER
     },
     name: {
       type: Sequelize.STRING,
       allowNull: false,
       unique: true
     },
     provider: {
       type: Sequelize.STRING,
       allowNull: false
     },
     fallback: {
       type: Sequelize.STRING // Use STRING
     },
     inputCostPer1k: {
       type: Sequelize.FLOAT,
       allowNull: false
     },
     outputCostPer1k: {
       type: Sequelize.FLOAT,
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
 async down(queryInterface, Sequelize) {
   await queryInterface.dropTable('Models');
 }
};

'use strict';

 /** @type {import('sequelize-cli').Migration} */
 module.exports = {
   async up (queryInterface, Sequelize) {
     // Add providers
     await queryInterface.bulkInsert('Providers', [
       {
         name: 'openai',
         apiBase: 'https://api.openai.com/v1',
         apiVersion: '2023-05-15',
         createdAt: new Date(),
         updatedAt: new Date()
       },
       {
         name: 'mistral',
         apiBase: 'https://api.mistral.ai/v1',
         apiVersion: '2023-10-26',
         createdAt: new Date(),
         updatedAt: new Date()
       }
     ], {});

     // Add models
     await queryInterface.bulkInsert('Models', [
         {
           name: 'gpt-3.5-turbo',
           provider: 'openai',
           fallback: JSON.stringify(['mistral-tiny']),
           inputCostPer1k: 0.0015,
           outputCostPer1k: 0.002,
           createdAt: new Date(),
           updatedAt: new Date()
         },
         {
           name: 'gpt-4',
           provider: 'openai',
           fallback: JSON.stringify(['mistral-large']),
           inputCostPer1k: 0.03,
           outputCostPer1k: 0.06,
           createdAt: new Date(),
           updatedAt: new Date()
         },
         {
           name: 'mistral-tiny',
           provider: 'mistral',
           fallback: JSON.stringify([]), // Empty array for no fallback
           inputCostPer1k: 0.00015,
           outputCostPer1k: 0.00075,
           createdAt: new Date(),
           updatedAt: new Date()
         },
         {
             name: 'mistral-small',
             provider: 'mistral',
             fallback: JSON.stringify([]), // Empty array for no fallback
             inputCostPer1k: 0.0006,
             outputCostPer1k: 0.0018,
             createdAt: new Date(),
             updatedAt: new Date()
         },
         {
             name: 'mistral-medium',
             provider: 'mistral',
             fallback: JSON.stringify([]), // Empty array for no fallback
             inputCostPer1k: 0.0027,
             outputCostPer1k: 0.0081,
             createdAt: new Date(),
             updatedAt: new Date()
         },
         {
           name: 'mistral-large',
           provider: 'mistral',
           fallback: JSON.stringify([]), // Empty array for no fallback
           inputCostPer1k: 0.008,
           outputCostPer1k: 0.024,
           createdAt: new Date(),
           updatedAt: new Date()
         }
     ], {});
   },

   async down (queryInterface, Sequelize) {
     /**
      * Add commands to revert seed here.
      *
      * Example:
      * await queryInterface.bulkDelete('People', null, {});
      */
     await queryInterface.bulkDelete('Models', null, {});
     await queryInterface.bulkDelete('Providers', null, {});
   }
 };


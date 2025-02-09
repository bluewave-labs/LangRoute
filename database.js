// database.js
const db = require('./models/index'); // Import the Sequelize models

// Test the connection (optional, but good practice)
db.sequelize.authenticate() // Use authenticate() for Sequelize
  .then(() => {
    console.log('Connected to PostgreSQL via Sequelize');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });
module.exports = db;


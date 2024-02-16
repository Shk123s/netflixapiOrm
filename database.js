const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('netflixdb', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql', // specify the dialect
  port: 3306,
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

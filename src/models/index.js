const sequelize = require('../config/db');
const Job = require('./Job');
const User = require('./User');

// Initialize models
const models = {
  Job,
  User
};

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Verify connection and sync
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Connection error:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('Models synchronized'))
  .catch(err => console.error('Sync error:', err));

module.exports = {
  Job,
  User,
  sequelize
};
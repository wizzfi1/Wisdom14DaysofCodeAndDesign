const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Register Job model via factory
const Job = require('./Job')(sequelize, DataTypes);

// Register User model (already initialized via class)
const User = require('./User'); // ✅ do not call it like a function

// Setup associations
const models = { Job, User };

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Connection error:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Models synchronized'))
  .catch(err => console.error('❌ Sync error:', err));

module.exports = {
  ...models,
  sequelize
};

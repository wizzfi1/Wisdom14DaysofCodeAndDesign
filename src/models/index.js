const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Register Job model via factory
const Job = require('./Job')(sequelize, DataTypes);

// Register User model (already initialized via class)
const User = require('./User'); // ✅ do not call it like a function

const Application = require('./Application')(sequelize, DataTypes);




// Setup associations
const models = { Job, User };

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
    models.Application = Application;
  }
});

module.exports = {
  ...models,
  sequelize
};

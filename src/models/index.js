const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Job = require('./Job')(sequelize, DataTypes);
const User = require('./User');
const Application = require('./Application')(sequelize, DataTypes);

const models = { Job, User, Application };

Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB Error:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Models synchronized'))
  .catch(err => console.error('❌ Sync error:', err));

module.exports = {
  ...models,
  sequelize
};

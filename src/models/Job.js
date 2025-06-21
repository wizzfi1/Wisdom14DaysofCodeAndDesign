const { Model, DataTypes } = require('sequelize');

class Job extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'employer_id',
      as: 'employer'
    });
  }
}

Job.init({
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  salary: DataTypes.FLOAT,
  location: DataTypes.STRING,
  jobType: DataTypes.STRING,
  minSalary: DataTypes.INTEGER,
  maxSalary: DataTypes.INTEGER,
  employer_id: DataTypes.INTEGER
}, {
  sequelize: require('../config/db'),
  modelName: 'job',
  tableName: 'jobs',
  timestamps: true
});

module.exports = Job;
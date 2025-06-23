module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    jobType: {
      type: DataTypes.ENUM(
        'full-time', 
        'part-time', 
        'contract', 
        'freelance', 
        'internship'
      ),
      allowNull: false
    },
    requirements: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // For PostgreSQL
      allowNull: false
    },
    employer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true // Soft deletes
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, {
      as: 'employer',
      foreignKey: 'employer_id'
    });
  };

  return Job;
};
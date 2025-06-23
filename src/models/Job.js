module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [5, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [20, 5000]
      }
    },
    company: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
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
      type: DataTypes.TEXT, // Changed from ARRAY to TEXT
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('requirements');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('requirements', JSON.stringify(value));
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'filled'),
      defaultValue: 'active'
    },
    employer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, {
      as: 'employer',
      foreignKey: 'employer_id'
    });
  };

  return Job;
};
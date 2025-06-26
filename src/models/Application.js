module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    applicant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resume_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cover_letter_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shortlisted', 'rejected'),
      defaultValue: 'pending',
    }
  }, {
    tableName: 'applications',
    timestamps: false
  });

  Application.associate = (models) => {
    Application.belongsTo(models.User, { as: 'applicant', foreignKey: 'applicant_id' });
    Application.belongsTo(models.Job, { as: 'job', foreignKey: 'job_id' });
  };

  return Application;
};

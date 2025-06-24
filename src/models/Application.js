module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    applicant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'jobs', key: 'id' },
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
    },
  }, {
    timestamps: false,
    tableName: 'applications',
  });

  Application.associate = (models) => {
    Application.belongsTo(models.User, { as: 'applicant', foreignKey: 'applicant_id' });
    Application.belongsTo(models.Job, { as: 'job', foreignKey: 'job_id' });
  };

  return Application;
};

module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    applicant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' } // ✅ lowercase
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'jobs', key: 'id' } // ✅ lowercase
    },
    resume_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cover_letter_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'applications' // 📝 Optional: explicitly set table name
  });

  Application.associate = models => {
    Application.belongsTo(models.User, { as: 'applicant', foreignKey: 'applicant_id' });
    Application.belongsTo(models.Job, { foreignKey: 'job_id' });
  };

  return Application;
};

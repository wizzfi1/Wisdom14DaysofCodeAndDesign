module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Jobs', {
      fields: ['employer_id'],
      type: 'foreign key',
      name: 'jobs_employer_id_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Jobs', 'jobs_employer_id_fkey');
  }
};
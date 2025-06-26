'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Check if table exists
      const tableExists = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'jobs'
        )`,
        { transaction }
      );

      if (tableExists[0][0].exists) {
        // 2. Check if column exists
        const columnExists = await queryInterface.sequelize.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'jobs' AND column_name = 'deletedAt'
          )`,
          { transaction }
        );

        // 3. Only remove if column exists
        if (columnExists[0][0].exists) {
          await queryInterface.removeColumn('jobs', 'deletedAt', { transaction });
          console.log('✅ deletedAt column removed from jobs table');
        } else {
          console.log('ℹ️ deletedAt column does not exist in jobs table - skipping');
        }
      } else {
        console.log('ℹ️ jobs table does not exist - skipping');
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Check if table exists
      const tableExists = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'jobs'
        )`,
        { transaction }
      );

      if (tableExists[0][0].exists) {
        // 2. Check if column exists before adding
        const columnExists = await queryInterface.sequelize.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'jobs' AND column_name = 'deletedAt'
          )`,
          { transaction }
        );

        // 3. Only add if column doesn't exist
        if (!columnExists[0][0].exists) {
          await queryInterface.addColumn('jobs', 'deletedAt', {
            type: Sequelize.DATE,
            allowNull: true
          }, { transaction });
          console.log('✅ deletedAt column added to jobs table');
        } else {
          console.log('ℹ️ deletedAt column already exists in jobs table - skipping');
        }
      } else {
        console.log('ℹ️ jobs table does not exist - skipping');
      }
    });
  }
};
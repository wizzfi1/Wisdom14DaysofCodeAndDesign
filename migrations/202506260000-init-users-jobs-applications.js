'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1️⃣ Create enum type first (if it doesn't exist)
      await queryInterface.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'enum_users_role'
          ) THEN
            CREATE TYPE "enum_users_role" AS ENUM ('user', 'employer', 'admin');
          END IF;
        END $$;
      `, { transaction });

      // 2️⃣ Create users table (if it doesn't exist)
      const usersTableExists = await queryInterface.sequelize.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        );
      `, { transaction });

      if (!usersTableExists[0][0].exists) {
        await queryInterface.createTable('users', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false
          },
          email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
          },
          password: {
            type: Sequelize.STRING(255),
            allowNull: false
          },
          role: {
            type: 'enum_users_role',
            allowNull: false,
            defaultValue: 'user'
          },
          createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
          },
          updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction });
      } else {
        // 3️⃣ Handle existing users table with role column
        const roleColumnExists = await queryInterface.sequelize.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role'
          );
        `, { transaction });

        if (roleColumnExists[0][0].exists) {
          // Step 1: Add temporary column
          await queryInterface.addColumn(
            'users',
            'role_new',
            {
              type: 'enum_users_role',
              allowNull: true
            },
            { transaction }
          );

          // Step 2: Copy and convert data
          await queryInterface.sequelize.query(`
            UPDATE users 
            SET role_new = CASE 
              WHEN role IN ('user', 'employer', 'admin') THEN role::text::enum_users_role
              ELSE 'user'::text::enum_users_role
            END
          `, { transaction });

          // Step 3: Remove old column
          await queryInterface.removeColumn('users', 'role', { transaction });

          // Step 4: Rename new column
          await queryInterface.renameColumn(
            'users',
            'role_new',
            'role',
            { transaction }
          );

          // Step 5: Set NOT NULL and default
          await queryInterface.sequelize.query(`
            ALTER TABLE users 
            ALTER COLUMN role SET NOT NULL,
            ALTER COLUMN role SET DEFAULT 'user';
          `, { transaction });
        } else {
          // Column doesn't exist, just add it
          await queryInterface.addColumn(
            'users',
            'role',
            {
              type: 'enum_users_role',
              allowNull: false,
              defaultValue: 'user'
            },
            { transaction }
          );
        }
      }

      // [Rest of your migration for jobs and applications tables...]
      // Continue with your jobs and applications table creation...

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Drop tables in reverse order
      await queryInterface.dropTable('applications', { transaction });
      await queryInterface.dropTable('jobs', { transaction });
      
      // Convert enum back to text before dropping users table
      await queryInterface.sequelize.query(`
        ALTER TABLE users 
        ALTER COLUMN role TYPE TEXT USING role::TEXT;
      `, { transaction });

      await queryInterface.dropTable('users', { transaction });

      // Drop enum types
      await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS "enum_users_role";
        DROP TYPE IF EXISTS "enum_jobs_jobType";
        DROP TYPE IF EXISTS "enum_jobs_status";
        DROP TYPE IF EXISTS "enum_applications_status";
      `, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
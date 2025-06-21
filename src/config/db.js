require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: 'public', // Explicitly set schema
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true,
      timestamps: true
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Enhanced connection test
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Verify the users table exists
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);
    
    if (!results[0].exists) {
      console.error('❌ Users table does not exist');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();

module.exports = sequelize;
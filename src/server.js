const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get('/api/always-works', (req, res) => {
  res.json({ message: `Server is working on port ${PORT}` });
});

app.get('/', (req, res) => {
  res.send('🌍 Welcome to the Wisdom Job Board API!');
});

// Route handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api', require('./routes/applicationRoutes'));

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// DB SYNC + START SERVER
const { sequelize } = require('./models');

async function startServer() {
  try {
    // 1. Authenticate database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // 2. Sync models with safe options
    await sequelize.sync({
      force: false,    // Don't drop tables
      alter: false     // Don't alter tables automatically
      // match: /_test$/ // Optional: Only sync tables ending with _test in test env
    });
    console.log('✅ Models synchronized');

    // 3. Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`POST http://localhost:${PORT}/api/auth/login`);
      console.log(`GET  http://localhost:${PORT}/api/jobs`);
      console.log(`GET  http://localhost:${PORT}/api/always-works (health check)`);
    });

  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1); // Exit with failure
  }
}

// Start the server
startServer();

// Handle unhandled rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
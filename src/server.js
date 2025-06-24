// server.js
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

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const applicationRoutes = require('./routes/applicationRoutes');
app.use('/api', applicationRoutes);

const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// DB SYNC + START SERVER
const { sequelize } = require('./models');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync({ alter: true }); // Use { force: true } for full reset
  })
  .then(() => {
    console.log('✅ Models synchronized');
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`POST http://localhost:${PORT}/api/auth/login`);
      console.log(`GET  http://localhost:${PORT}/api/jobs`);
    });
  })
  .catch(err => {
    console.error('❌ Startup error:', err);
  });

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

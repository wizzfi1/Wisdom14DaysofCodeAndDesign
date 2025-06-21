const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE (Must come first!) =====
app.use(cors()); // Allow frontend connections
app.use(morgan('dev')); // Log requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ===== ROUTES =====
// Test route
app.get('/api/always-works', (req, res) => {
  res.json({ message: `Server is working on port ${PORT}` });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // Now handles /api/auth/login

// Job routes
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes); // Handles /api/jobs

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log(`POST http://localhost:${PORT}/api/auth/login`);
  console.log(`GET  http://localhost:${PORT}/api/jobs`);
});
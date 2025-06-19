const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Logs requests
require('dotenv').config(); // Loads .env

// Initialize Express
const app = express();

// Add these critical middleware BEFORE your routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // All auth routes start with /api/auth

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev')); // Log requests in console
app.use('/api', authRoutes); // Now handles /api/protected-route




// Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('uh ohhh!');
});

module.exports = app;
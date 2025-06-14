const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Logs requests
require('dotenv').config(); // Loads .env

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev')); // Log requests in console

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
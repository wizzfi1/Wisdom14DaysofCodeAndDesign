const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe
} = require('../controllers/authController');
const {
  validateRegister,
  validateLogin
} = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Test route for debugging
router.get('/test', (req, res) => res.json({ message: 'Auth routes working' }));

// Register new user
router.post('/register', validateRegister, registerUser);

// Login user
router.post('/login', validateLogin, loginUser);

// Get logged-in user profile
router.get('/me', protect, getMe);

module.exports = router;
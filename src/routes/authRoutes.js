const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth'); // Add this line
const { register, login } = require('../controllers/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected route example
router.get('/protected-route', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
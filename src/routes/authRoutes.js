// src/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const { protect } = require('../middleware/authMiddleware'); // JWT verification middleware
const authController = require('../controllers/auth');
router.get('/protected-route', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user, // User data from JWT
    message: "Accessed protected route"
  });
});


router.post('/register', register);
router.post('/login', authController.login);

module.exports = router;


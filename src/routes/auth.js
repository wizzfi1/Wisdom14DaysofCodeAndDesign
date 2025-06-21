// Example route file
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Protected route
router.get('/protected', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Admin-only route
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Admin access granted' });
});

module.exports = router;
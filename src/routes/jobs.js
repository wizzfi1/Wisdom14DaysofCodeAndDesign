const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobs');

// Import with consistent naming
const { protect, authorize } = require('../middleware/auth');
const { validateJobQuery } = require('../middleware/validation');

// Public route (only needs validation)
router.get(
  '/',
  validateJobQuery,
  getAllJobs
);

// Protected routes
router.use(protect); // Applies to all routes below

// Employer-only routes
router.post('/', authorize('employer', 'admin'), createJob);
router.put('/:id', authorize('employer', 'admin'), updateJob);
router.delete('/:id', authorize('employer', 'admin'), deleteJob);

module.exports = router;
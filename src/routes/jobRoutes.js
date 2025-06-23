const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs');
const { protect, authorize } = require('../middleware/auth');
const { validateJobCreate, validateJobQuery } = require('../middleware/validation');

// Public routes
router.get('/', validateJobQuery, jobsController.getAllJobs);

// Protected routes
router.post(
  '/',
  protect,
  authorize('employer', 'admin'),
  validateJobCreate,
  jobsController.createJob
);

router.put(
  '/:id',
  protect,
  authorize('employer', 'admin'),
  validateJobCreate,
  jobsController.updateJob
);

router.delete(
  '/:id',
  protect,
  authorize('employer', 'admin'),
  jobsController.deleteJob
);

module.exports = router;
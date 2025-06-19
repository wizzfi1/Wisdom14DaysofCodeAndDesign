const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobs');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getJobs);
  
router.route('/:id')
  .get(getJob);

// Protected employer-only routes
router.use(protect, authorize('employer'));

router.route('/')
  .post(createJob);

router.route('/:id')
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
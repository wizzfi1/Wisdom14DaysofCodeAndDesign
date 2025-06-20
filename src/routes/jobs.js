const express = require('express');
const router = express.Router();

const {
  getJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobs');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);

// Protected employer routes
router.use(protect, authorize('employer'));

router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
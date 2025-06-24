const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getApplicationsForJob, getMyApplications } = require('../controllers/applicationController');
const router = express.Router();

router.get(
  '/jobs/:jobId/applications',
  protect,
  authorize('employer'),
  getApplicationsForJob
);

router.get(
  '/my-applications',
  protect,
  authorize('applicant'),
  getMyApplications
);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  applyToJob,
  getApplicationsForJob,
  getMyApplications
} = require('../controllers/applicationController');

router.post(
  '/apply/:jobId',
  protect,
  authorize('applicant'),
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  applyToJob
);

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

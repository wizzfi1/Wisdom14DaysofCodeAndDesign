const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { applyToJob } = require('../controllers/applicationController');

// Applicants only route
router.post(
  '/apply/:jobId',
  protect,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  applyToJob
);

module.exports = router;

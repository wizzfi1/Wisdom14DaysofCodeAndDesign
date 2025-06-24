const { Application } = require('../models');

exports.applyToJob = async (req, res) => {
  const applicantId = req.user.id;
  const jobId = req.params.jobId;
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ success: false, error: 'Resume is required' });
  }

  try {
    // Prevent duplicates
    const existing = await Application.findOne({ where: { applicant_id: applicantId, job_id: jobId } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Already applied to this job' });
    }

    // Save record
    const resume = req.files.resume[0].path;
    const coverLetter = req.files.coverLetter ? req.files.coverLetter[0].path : null;

    const app = await Application.create({
      applicant_id: applicantId,
      job_id: jobId,
      resume_path: resume,
      cover_letter_path: coverLetter
    });

    res.status(201).json({ success: true, data: app });
  } catch (err) {
    console.error('❌ Application Error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
};

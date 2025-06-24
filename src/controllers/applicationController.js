const { Application, Job, User } = require('../models');

// Employer: view applications for a specific job
exports.getApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;
  const employerId = req.user.id;

  const job = await Job.findByPk(jobId);
  if (!job || job.employer_id !== employerId) {
    return res.status(403).json({ success: false, error: 'Not authorized or job not found' });
  }

  const applications = await Application.findAll({
    where: { job_id: jobId },
    include: [{ model: User, as: 'applicant', attributes: ['id', 'name', 'email'] }],
    order: [['submitted_at', 'DESC']],
  });

  res.json({ success: true, count: applications.length, applications });
};

// Applicant: view their own applications
exports.getMyApplications = async (req, res) => {
  const applicantId = req.user.id;

  const applications = await Application.findAll({
    where: { applicant_id: applicantId },
    include: [{ model: Job, as: 'job' }],
    order: [['submitted_at', 'DESC']],
  });

  res.json({ success: true, count: applications.length, applications });
};

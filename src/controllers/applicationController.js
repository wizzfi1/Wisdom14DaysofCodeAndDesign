const { Application, Job, User } = require('../models');

exports.applyToJob = async (req, res) => {
  try {
    const applicant_id = req.user.id;
    const job_id = parseInt(req.params.jobId, 10);

    const job = await Job.findByPk(job_id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

    const existing = await Application.findOne({ where: { job_id, applicant_id } });
    if (existing) return res.status(400).json({ success: false, error: 'You already applied to this job' });

    const resume = req.files.resume?.[0]?.path;
    const cover = req.files.coverLetter?.[0]?.path || null;

    if (!resume) return res.status(400).json({ success: false, error: 'Resume is required' });

    const app = await Application.create({
      applicant_id,
      job_id,
      resume_path: resume,
      cover_letter_path: cover
    });

    res.status(201).json({ success: true, application: app });
  } catch (err) {
    console.error('❌ Application Error:', err);
    res.status(500).json({ success: false, error: 'Failed to apply' });
  }
};

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

exports.getMyApplications = async (req, res) => {
  const applicantId = req.user.id;

  const applications = await Application.findAll({
    where: { applicant_id: applicantId },
    include: [{ model: Job, as: 'job' }],
    order: [['submitted_at', 'DESC']],
  });

  res.json({ success: true, count: applications.length, applications });
};

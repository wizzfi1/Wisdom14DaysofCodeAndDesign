const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name email');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private/Employer
exports.createJob = async (req, res) => {
  try {
    // Add employer to req.body
    req.body.employer = req.user.id;
    
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Verify job belongs to employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Verify job belongs to employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this job' });
    }

    await job.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
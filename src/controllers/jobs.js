const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      employerId: req.user.id
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedJob = await Job.update(req.params.id, req.body);
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Job.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
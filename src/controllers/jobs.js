const { Job, User } = require('../models');
const { Op } = require('sequelize');

// GET /api/jobs - Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const {
      jobType,
      location,
      minSalary,
      maxSalary,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status: 'active' };

    // Build filters
    if (jobType) where.jobType = jobType;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (minSalary || maxSalary) {
      where.salary = {};
      if (minSalary) where.salary[Op.gte] = Number(minSalary);
      if (maxSalary) where.salary[Op.lte] = Number(maxSalary);
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Job.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, sortOrder]],
      include: [{
        association: 'employer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(200).json({
      success: true,
      metadata: {
        totalJobs: count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page)
      },
      data: rows
    });
  } catch (err) {
    console.error('❌ Job Fetch Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch jobs',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// POST /api/jobs - Create new job
exports.createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      employer_id: req.user.id,
      status: 'active'
    };

    const job = await Job.create(jobData);

    const jobWithEmployer = await Job.findByPk(job.id, {
      include: [{
        association: 'employer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      data: jobWithEmployer
    });
  } catch (err) {
    console.error('❌ Job Create Error:', err);
    
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: err.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create job'
    });
  }
};

// PUT /api/jobs/:id - Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        employer_id: req.user.id
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or not authorized'
      });
    }

    await job.update(req.body);
    
    const updatedJob = await Job.findByPk(job.id, {
      include: [{
        association: 'employer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      data: updatedJob
    });
  } catch (err) {
    console.error('❌ Job Update Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update job'
    });
  }
};

// DELETE /api/jobs/:id - Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        employer_id: req.user.id
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or not authorized'
      });
    }

    await job.destroy();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('❌ Job Delete Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete job'
    });
  }
};
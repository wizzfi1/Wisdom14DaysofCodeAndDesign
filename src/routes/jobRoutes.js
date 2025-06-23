const express = require('express');
const router = express.Router();
const { Job } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { validateJobCreate, validateJobQuery } = require('../middleware/validation');

// @desc    Get all jobs (public)
// @route   GET /api/jobs
// @access  Public
router.get('/', validateJobQuery, async (req, res) => {
  try {
    const { page = 1, limit = 10, ...query } = req.query;
    
    const jobs = await Job.findAndCountAll({
      where: query,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [{
        association: 'employer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      success: true,
      count: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: parseInt(page),
      data: jobs.rows
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching jobs'
    });
  }
});

// @desc    Get single job (public)
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{
        association: 'employer',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching job'
    });
  }
});

// @desc    Create job (employer only)
// @route   POST /api/jobs
// @access  Private/Employer
router.post(
  '/',
  protect,
  authorize('employer', 'admin'),
  validateJobCreate,
  async (req, res) => {
    try {
      const job = await Job.create({
        ...req.body,
        employer_id: req.user.id
      });

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
      res.status(400).json({
        success: false,
        error: 'Invalid job data'
      });
    }
  }
);

// @desc    Update job (owner only)
// @route   PUT /api/jobs/:id
// @access  Private/Employer
router.put(
  '/:id',
  protect,
  authorize('employer', 'admin'),
  validateJobCreate,
  async (req, res) => {
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
      res.status(400).json({
        success: false,
        error: 'Invalid job data'
      });
    }
  }
);

// @desc    Delete job (owner only)
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
router.delete(
  '/:id',
  protect,
  authorize('employer', 'admin'),
  async (req, res) => {
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
      res.status(500).json({
        success: false,
        error: 'Server error deleting job'
      });
    }
  }
);

module.exports = router;
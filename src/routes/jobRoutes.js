const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { protect } = require('../middleware/auth');
const { validateJobQuery, validateJobCreate } = require('../middleware/validation');
const { Job, User } = require('../models');

// Get all jobs with filtering, pagination, and sorting
router.get('/', 
  validateJobQuery,
  async (req, res) => {
    try {
      const { 
        jobType, 
        location, 
        minSalary, 
        maxSalary,
        search,
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      // Build filter object
      const where = {};
      if (jobType) where.jobType = jobType;
      if (location) where.location = { [Op.iLike]: `%${location}%` };
      if (minSalary || maxSalary) {
        where.salary = {};
        if (minSalary) where.salary[Op.gte] = parseInt(minSalary);
        if (maxSalary) where.salary[Op.lte] = parseInt(maxSalary);
      }
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { company: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const jobs = await Job.findAndCountAll({
        where,
        include: [{
          model: User,
          as: 'employer',
          attributes: ['id', 'name', 'email']
        }],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        distinct: true
      });

      res.json({
        success: true,
        count: jobs.count,
        totalPages: Math.ceil(jobs.count / limit),
        currentPage: parseInt(page),
        data: jobs.rows
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch jobs',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.message 
        })
      });
    }
  }
);

// Create a new job
router.post('/', 
  protect,
  validateJobCreate,
  async (req, res) => {
    try {
      // Verify employer role
      if (req.user.role !== 'employer' && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          error: 'Only employers can post jobs' 
        });
      }

      const job = await Job.create({
        ...req.body,
        employer_id: req.user.id
      });

      // Fetch job with employer details
      const jobWithEmployer = await Job.findByPk(job.id, {
        include: [{
          model: User,
          as: 'employer',
          attributes: ['id', 'name', 'email']
        }]
      });

      res.status(201).json({
        success: true,
        data: jobWithEmployer
      });
    } catch (error) {
      console.error('Job creation error:', error);
      res.status(400).json({ 
        success: false,
        error: 'Invalid job data',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.errors?.map(e => e.message) 
        })
      });
    }
  }
);

module.exports = router;
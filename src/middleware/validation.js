const Joi = require('joi');

// Utility function for consistent error responses
const validationErrorResponse = (res, error) => {
  const errors = error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message.replace(/['"]/g, ''),
    type: detail.type
  }));

  console.log('Validation errors:', errors);
  
  return res.status(400).json({
    success: false,
    error: 'Validation failed',
    errors
  });
};

// Common schemas
const emailSchema = Joi.string().email().required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  });

const passwordSchema = Joi.string()
  .min(8)
  .required()
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
  .messages({
    'string.min': 'Password must be at least {#limit} characters',
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
  });

// Auth validations
exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least {#limit} characters'
      }),
    email: emailSchema,
    password: passwordSchema,
    role: Joi.string().valid('user', 'admin', 'employer').default('user')
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) return validationErrorResponse(res, error);
  
  req.body = value;
  next();
};

exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: emailSchema,
    password: Joi.string().required()
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) return validationErrorResponse(res, error);
  
  req.body = value;
  next();
};

// Job validations
exports.validateJobQuery = (req, res, next) => {
  const schema = Joi.object({
    jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'freelance', 'internship'),
    location: Joi.string(),
    minSalary: Joi.number().min(0),
    maxSalary: Joi.number().min(0),
    search: Joi.string(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sortBy: Joi.string().valid('title', 'salary', 'createdAt', 'updatedAt').default('createdAt'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  });

  const { error, value } = schema.validate(req.query, { abortEarly: false });

  if (error) return validationErrorResponse(res, error);
  
  req.query = value;
  next();
};

exports.validateJobCreate = (req, res, next) => {
  console.log('Job creation input:', req.body);

  const schema = Joi.object({
    title: Joi.string().min(5).max(100).required()
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least {#limit} characters'
      }),
    description: Joi.string().min(20).required()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least {#limit} characters'
      }),
    company: Joi.string().min(2).max(50).required(),
    location: Joi.string().required(),
    salary: Joi.number().min(0),
    jobType: Joi.string()
      .valid('full-time', 'part-time', 'contract', 'freelance', 'internship')
      .required(),
    requirements: Joi.array().items(Joi.string()).min(1).required()
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log('Job validation errors:', error.details);
    return validationErrorResponse(res, error);
  }
  
  req.body = value;
  next();
};
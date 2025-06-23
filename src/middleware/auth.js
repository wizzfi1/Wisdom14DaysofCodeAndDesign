const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Verify token exists
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({
        success: false,
        error: 'Not authorized, no token provided'
      });
    }

    // 3. Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // 4. Get user from token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // 5. Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('Authentication Error:', err.message);
    
    let errorMessage = 'Not authorized';
    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
    }

    return res.status(401).json({
      success: false,
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Add this to check job ownership
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    const resource = await model.findOne({
      where: {
        id: req.params.id,
        employer_id: req.user.id
      }
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found or not authorized'
      });
    }

    next();
  };
};

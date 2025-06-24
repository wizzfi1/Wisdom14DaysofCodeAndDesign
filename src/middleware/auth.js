const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ✅ Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token missing'
      });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    console.error('Authentication Error:', err);

    let message = 'Not authorized';
    if (err.name === 'TokenExpiredError') message = 'Token expired';
    if (err.name === 'JsonWebTokenError') message = 'Invalid token';

    return res.status(401).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
};

// ✅ Role-based authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// ✅ Resource ownership middleware (e.g. job owned by employer)
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    const resource = await model.findOne({
      where: {
        id: req.params.id,
        employer_id: req.user.id
      }
    });

    if (!resource) {
      return res.status(403).json({
        success: false,
        error: 'Resource not found or not owned by you'
      });
    }

    next();
  };
};

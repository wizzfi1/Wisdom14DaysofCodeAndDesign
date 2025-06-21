const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sanitizeUser = (user) => {
  const userData = user.get({ plain: true });
  delete userData.password;
  return userData;
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: 'User already exists' 
      });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Registration Error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );

    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// Fixed getMe function with proper parentheses
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};
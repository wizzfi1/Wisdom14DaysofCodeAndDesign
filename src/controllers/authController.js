const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if email exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📥 Email:', email);
    console.log('📥 Password (raw):', password);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ No user found');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    console.log('🔐 Hashed password in DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Password match result:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};


// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('GetMe Error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error fetching profile'
    });
  }
};
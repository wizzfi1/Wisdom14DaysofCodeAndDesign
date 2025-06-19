const pool = require('../config/db'); // Directly use pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Add this above your login function
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Keep your existing login function
exports.login = async (req, res) => {
  // ... your existing login code ...
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Direct database query
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
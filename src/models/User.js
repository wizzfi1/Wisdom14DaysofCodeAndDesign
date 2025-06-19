const pool = require('../config/db');

module.exports = {
  findUserByEmail: async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },
  createUser: async (email, password, role) => {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, password, role]
    );
    return rows[0];
  }
};
const pool = require('../config/db');

class Job {
  static async create({ title, description, salary, company, location, employerId }) {
    const query = `
      INSERT INTO jobs (title, description, salary, company, location, employer_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description, salary, company, location, employerId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM jobs');
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    return rows[0];
  }

  static async update(id, updates) {
    const setClause = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    
    const query = `
      UPDATE jobs
      SET ${setClause}
      WHERE id = $${Object.keys(updates).length + 1}
      RETURNING *
    `;
    const values = [...Object.values(updates), id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
  }
}

module.exports = Job;
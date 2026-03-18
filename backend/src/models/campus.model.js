const { pool } = require('../db');

class CampusModel {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM campus');
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM campus WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async create(nomecampus) {
    const { rows } = await pool.query('INSERT INTO campus (nomecampus) VALUES ($1) RETURNING *', [nomecampus]);
    return rows[0];
  }

  async update(id, nomecampus) {
    const { rows } = await pool.query('UPDATE campus SET nomecampus=$1 WHERE id=$2 RETURNING *', [nomecampus, id]);
    return rows[0] || null;
  }

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM campus WHERE id=$1', [id]);
    return rowCount > 0;
  }

  async existsByName(nomecampus) {
    const { rows } = await pool.query('SELECT id FROM campus WHERE nomecampus=$1', [nomecampus]);
    return rows.length > 0;
  }
}

module.exports = new CampusModel();

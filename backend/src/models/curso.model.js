const { pool } = require('../db');

class CursoModel {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM curso');
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM curso WHERE id=$1', [id]);
    return rows[0] || null;
  }
}

module.exports = new CursoModel();

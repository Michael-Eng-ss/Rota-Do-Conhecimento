const { pool } = require('../db');

class PerguntaNivelModel {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM perguntasnivel');
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM perguntasnivel WHERE id=$1', [id]);
    return rows[0] || null;
  }
}

module.exports = new PerguntaNivelModel();

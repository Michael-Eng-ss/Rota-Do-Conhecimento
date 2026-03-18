const { pool } = require('../db');

class LogModel {
  async create(usuariosid, descricao) {
    const { rows } = await pool.query(
      'INSERT INTO logs (usuariosid,descricao) VALUES ($1,$2) RETURNING *',
      [usuariosid, descricao]
    );
    return rows[0];
  }

  async findByDateRange(startDate, endDate) {
    const { rows } = await pool.query(
      'SELECT datalogin, usuariosid FROM logs WHERE datalogin >= $1 AND datalogin <= $2',
      [startDate, endDate]
    );
    return rows;
  }
}

module.exports = new LogModel();

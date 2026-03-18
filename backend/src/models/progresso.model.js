const { pool } = require('../db');

class ProgressoModel {
  async findByUsuarioAndPerguntaIds(usuarioId, perguntaIds) {
    if (perguntaIds.length === 0) return [];
    const { rows } = await pool.query(
      'SELECT * FROM progressoperguntas WHERE usuariosid=$1 AND perguntasid = ANY($2)',
      [usuarioId, perguntaIds]
    );
    return rows;
  }

  async findAnsweredIds(usuarioId) {
    const { rows } = await pool.query('SELECT perguntasid FROM progressoperguntas WHERE usuariosid=$1', [usuarioId]);
    return rows.map(p => p.perguntasid);
  }

  async create(usuariosid, perguntasid) {
    const { rows } = await pool.query(
      'INSERT INTO progressoperguntas (usuariosid,perguntasid) VALUES ($1,$2) RETURNING *',
      [usuariosid, perguntasid]
    );
    return rows[0];
  }

  async exists(usuariosid, perguntasid) {
    const { rows } = await pool.query(
      'SELECT id FROM progressoperguntas WHERE usuariosid=$1 AND perguntasid=$2',
      [usuariosid, perguntasid]
    );
    return rows.length > 0;
  }
}

module.exports = new ProgressoModel();

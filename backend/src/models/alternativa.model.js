const { pool } = require('../db');

class AlternativaModel {
  async findByPergunta(perguntaId) {
    const { rows } = await pool.query('SELECT * FROM alternativas WHERE perguntasid=$1', [perguntaId]);
    return rows;
  }

  async findByPerguntaIds(ids) {
    if (ids.length === 0) return [];
    const { rows } = await pool.query('SELECT * FROM alternativas WHERE perguntasid = ANY($1)', [ids]);
    return rows;
  }

  async create(data) {
    const { rows } = await pool.query(
      'INSERT INTO alternativas (perguntasid,conteudo,imagem,correta) VALUES ($1,$2,$3,$4) RETURNING *',
      [data.perguntasid, data.conteudo||null, data.imagem||null, data.correta||false]
    );
    return rows[0];
  }

  async update(id, data) {
    const { rows } = await pool.query(
      'UPDATE alternativas SET conteudo=$1, imagem=$2, correta=$3 WHERE id=$4 RETURNING *',
      [data.conteudo, data.imagem, data.correta, id]
    );
    return rows[0] || null;
  }

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM alternativas WHERE id=$1', [id]);
    return rowCount > 0;
  }

  async deleteByPergunta(perguntaId) {
    await pool.query('DELETE FROM alternativas WHERE perguntasid=$1', [perguntaId]);
  }

  async countByPergunta(perguntaId) {
    const { rows } = await pool.query('SELECT COUNT(*)::int as count FROM alternativas WHERE perguntasid=$1', [perguntaId]);
    return rows[0].count;
  }

  async hasCorrectByPergunta(perguntaId) {
    const { rows } = await pool.query('SELECT id FROM alternativas WHERE perguntasid=$1 AND correta=true', [perguntaId]);
    return rows.length > 0;
  }
}

module.exports = new AlternativaModel();

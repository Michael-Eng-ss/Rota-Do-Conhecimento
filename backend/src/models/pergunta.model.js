const { pool } = require('../db');

class PerguntaModel {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM perguntas WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM perguntas ORDER BY id DESC');
    return rows;
  }

  async findByCategoria(categoriaId, activeOnly = true) {
    let q = 'SELECT * FROM perguntas WHERE categoriasid=$1';
    if (activeOnly) q += ' AND status=true';
    const { rows } = await pool.query(q, [categoriaId]);
    return rows;
  }

  async findByQuiz(quizId, filters = {}) {
    let q = 'SELECT * FROM perguntas WHERE quizid=$1 AND status=true';
    const params = [quizId];
    let idx = 2;

    if (filters.categoriaId) { q += ` AND categoriasid=$${idx}`; params.push(filters.categoriaId); idx++; }
    if (filters.excludeIds && filters.excludeIds.length > 0) {
      q += ` AND id != ALL($${idx})`; params.push(filters.excludeIds); idx++;
    }

    q += ` LIMIT $${idx} OFFSET $${idx + 1}`;
    params.push(filters.take || 20, filters.skip || 0);
    const { rows } = await pool.query(q, params);
    return rows;
  }

  async create(data) {
    const { rows } = await pool.query(
      'INSERT INTO perguntas (conteudo,perguntasnivelid,tempo,pathimage,status,categoriasid,quizid) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [data.conteudo, data.perguntasnivelid||1, data.tempo||30, data.pathimage||null, data.status??true, data.categoriasid, data.quizid||null]
    );
    return rows[0];
  }

  async update(id, fields) {
    const keys = []; const vals = []; let i = 1;
    for (const k of ['conteudo','perguntasnivelid','tempo','pathimage','categoriasid','quizid','status']) {
      if (fields[k] !== undefined) { keys.push(`${k}=$${i}`); vals.push(fields[k]); i++; }
    }
    if (keys.length === 0) return null;
    vals.push(id);
    await pool.query(`UPDATE perguntas SET ${keys.join(',')} WHERE id=$${i}`, vals);
    const { rows } = await pool.query('SELECT * FROM perguntas WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async toggleStatus(id) {
    const { rows: [existing] } = await pool.query('SELECT status FROM perguntas WHERE id=$1', [id]);
    if (!existing) return null;
    const { rows } = await pool.query('UPDATE perguntas SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, id]);
    return rows[0];
  }

  async delete(id) {
    const { rowCount } = await pool.query('SELECT id FROM perguntas WHERE id=$1', [id]);
    if (rowCount === 0) return false;
    await pool.query('DELETE FROM alternativas WHERE perguntasid=$1', [id]);
    await pool.query('DELETE FROM perguntas WHERE id=$1', [id]);
    return true;
  }
}

module.exports = new PerguntaModel();

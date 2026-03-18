const { pool } = require('../db');

class QuizModel {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM quiz WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async findAll(skip, take) {
    const { rows } = await pool.query('SELECT * FROM quiz LIMIT $1 OFFSET $2', [take, skip]);
    return rows;
  }

  async findByCurso(cursoId, skip, take) {
    const { rows } = await pool.query('SELECT * FROM quiz WHERE cursoid=$1 LIMIT $2 OFFSET $3', [cursoId, take, skip]);
    return rows;
  }

  async findByUsuarioAndCurso(userId, cursoId, skip, take, avaliativo = null) {
    let q = 'SELECT * FROM quiz WHERE cursoid=$1 AND usuarioid=$2';
    const params = [cursoId, userId];
    if (avaliativo !== null) { q += ' AND avaliativo=$3'; params.push(avaliativo); }
    q += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(take, skip);
    const { rows } = await pool.query(q, params);
    return rows;
  }

  async create(data) {
    const { rows } = await pool.query(
      'INSERT INTO quiz (titulo,cursoid,imagem,status,avaliativo,usuarioid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [data.titulo, data.cursoid, data.imagem||'', data.status??true, data.avaliativo??false, data.usuarioid]
    );
    return rows[0];
  }

  async update(id, titulo, imagem) {
    const { rows } = await pool.query('UPDATE quiz SET titulo=$1, imagem=$2 WHERE id=$3 RETURNING *', [titulo, imagem, id]);
    return rows[0] || null;
  }

  async toggleStatus(id) {
    const { rows: [existing] } = await pool.query('SELECT status FROM quiz WHERE id=$1', [id]);
    if (!existing) return null;
    const { rows } = await pool.query('UPDATE quiz SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, id]);
    return rows[0];
  }
}

module.exports = new QuizModel();

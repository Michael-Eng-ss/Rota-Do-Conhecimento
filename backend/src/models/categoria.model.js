const { pool } = require('../db');

class CategoriaModel {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM categorias WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async findByCurso(cursoId) {
    const { rows } = await pool.query('SELECT * FROM categorias WHERE "cursoId"=$1 AND status=true', [cursoId]);
    return rows;
  }

  async findByQuiz(quizId) {
    const { rows: perguntas } = await pool.query('SELECT DISTINCT categoriasid FROM perguntas WHERE quizid=$1', [quizId]);
    const catIds = perguntas.map(p => p.categoriasid);
    if (catIds.length === 0) return [];
    const { rows } = await pool.query('SELECT * FROM categorias WHERE id = ANY($1)', [catIds]);
    return rows;
  }

  async create(descricao, cursoId, imagem) {
    const { rows } = await pool.query(
      'INSERT INTO categorias (descricao,imagem,"cursoId") VALUES ($1,$2,$3) RETURNING *',
      [descricao, imagem||'', cursoId]
    );
    return rows[0];
  }

  async update(id, descricao, imagem) {
    const { rows } = await pool.query(
      'UPDATE categorias SET descricao=$1, imagem=$2 WHERE id=$3 RETURNING *',
      [descricao, imagem, id]
    );
    return rows[0] || null;
  }

  async toggleStatus(id) {
    const { rows: [existing] } = await pool.query('SELECT status FROM categorias WHERE id=$1', [id]);
    if (!existing) return null;
    const { rows } = await pool.query('UPDATE categorias SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, id]);
    return rows[0];
  }

  async existsByNameAndCurso(descricao, cursoId) {
    const { rows } = await pool.query('SELECT id FROM categorias WHERE descricao=$1 AND "cursoId"=$2', [descricao, cursoId]);
    return rows.length > 0;
  }
}

module.exports = new CategoriaModel();

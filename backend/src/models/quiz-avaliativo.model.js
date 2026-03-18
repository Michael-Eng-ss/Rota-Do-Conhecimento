const { pool } = require('../db');

class QuizAvaliativoModel {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM quiz_avaliativo_usuario WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async findByQuiz(quizId, skip, take) {
    const { rows } = await pool.query(
      'SELECT * FROM quiz_avaliativo_usuario WHERE quizid=$1 LIMIT $2 OFFSET $3',
      [quizId, take, skip]
    );
    return rows;
  }

  async create(data) {
    const { rows } = await pool.query(
      'INSERT INTO quiz_avaliativo_usuario (quizid,usuarioid,pontuacao,horainicial,horafinal) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [data.quizid, data.usuarioid, data.pontuacao, data.horainicial||new Date().toISOString(), data.horafinal||new Date().toISOString()]
    );
    return rows[0];
  }

  async existsByQuizAndUsuario(quizId, usuarioId) {
    const { rows } = await pool.query(
      'SELECT id FROM quiz_avaliativo_usuario WHERE quizid=$1 AND usuarioid=$2',
      [quizId, usuarioId]
    );
    return rows.length > 0;
  }
}

module.exports = new QuizAvaliativoModel();

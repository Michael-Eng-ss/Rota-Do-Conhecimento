const progressoModel = require('../models/progresso.model');
const { pool } = require('../db');
const ProgressoPerguntas = require('../entities/progresso.entity');
const { AppError } = require('../middlewares');

class ProgressoController {
  async create(body) {
    const items = Array.isArray(body) ? body : [body];
    if (!items[0].usuariosid || !items[0].perguntasid) throw new AppError('Campos usuariosid e perguntasid são obrigatórios', 400);

    const results = [];
    for (const item of items) {
      if (await progressoModel.exists(item.usuariosid, item.perguntasid)) {
        throw new AppError('Progresso ja existe para essa pergunta', 400);
      }
      const row = await progressoModel.create(item.usuariosid, item.perguntasid);
      results.push(ProgressoPerguntas.fromRow(row));
    }
    return Array.isArray(body) ? results : results[0];
  }

  async getByQuizAndUsuario(quizId, userId) {
    const { rows: perguntas } = await pool.query('SELECT id FROM perguntas WHERE quizid=$1', [quizId]);
    const ids = perguntas.map(p => p.id);
    if (ids.length === 0) return [];
    const rows = await progressoModel.findByUsuarioAndPerguntaIds(userId, ids);
    return ProgressoPerguntas.fromRows(rows);
  }

  async getByCategoriaQuizAndUsuario(catId, quizId, userId) {
    const { rows: perguntas } = await pool.query('SELECT id FROM perguntas WHERE quizid=$1 AND categoriasid=$2', [quizId, catId]);
    const ids = perguntas.map(p => p.id);
    if (ids.length === 0) return [];
    const rows = await progressoModel.findByUsuarioAndPerguntaIds(userId, ids);
    return ProgressoPerguntas.fromRows(rows);
  }
}

module.exports = new ProgressoController();

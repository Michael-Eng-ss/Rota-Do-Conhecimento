const quizAvaliativoModel = require('../models/quiz-avaliativo.model');
const QuizAvaliativoUsuario = require('../entities/quiz-avaliativo-usuario.entity');
const { AppError } = require('../middlewares');

class QuizAvaliativoController {
  async getById(id) {
    const row = await quizAvaliativoModel.findById(id);
    if (!row) throw new AppError('Pontuacao nao encontrada', 404);
    return QuizAvaliativoUsuario.fromRow(row);
  }

  async getByQuiz(quizId, skip, take) {
    const rows = await quizAvaliativoModel.findByQuiz(quizId, skip, take);
    return QuizAvaliativoUsuario.fromRows(rows);
  }

  async create(data) {
    if (!data.quizid || !data.usuarioid) throw new AppError('Campos quizid e usuarioid são obrigatórios', 400);
    if (data.pontuacao < 0) throw new AppError('A pontuacao nao pode ser negativa', 400);
    if (await quizAvaliativoModel.existsByQuizAndUsuario(data.quizid, data.usuarioid)) {
      throw new AppError('Pontuacao ja existe para este quiz e usuario', 400);
    }
    const row = await quizAvaliativoModel.create(data);
    return QuizAvaliativoUsuario.fromRow(row);
  }
}

module.exports = new QuizAvaliativoController();

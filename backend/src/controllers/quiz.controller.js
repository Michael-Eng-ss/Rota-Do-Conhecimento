const quizModel = require('../models/quiz.model');
const Quiz = require('../entities/quiz.entity');
const { AppError } = require('../middlewares');

class QuizController {
  async getById(id) {
    const row = await quizModel.findById(id);
    if (!row) throw new AppError('Quiz nao encontrado', 404);
    return Quiz.fromRow(row);
  }

  async getAll(skip, take) {
    const rows = await quizModel.findAll(skip, take);
    return Quiz.fromRows(rows);
  }

  async getByCurso(cursoId, skip, take) {
    const rows = await quizModel.findByCurso(cursoId, skip, take);
    return Quiz.fromRows(rows);
  }

  async getByUsuarioAndCurso(userId, cursoId, skip, take, avaliativo) {
    const rows = await quizModel.findByUsuarioAndCurso(userId, cursoId, skip, take, avaliativo);
    return Quiz.fromRows(rows);
  }

  async create(data) {
    if (!data.cursoid) throw new AppError('Campo cursoid é obrigatório', 400);
    if (!data.usuarioid) throw new AppError('Campo usuarioid é obrigatório', 400);
    const row = await quizModel.create(data);
    return Quiz.fromRow(row);
  }

  async update(id, titulo, imagem) {
    if (!titulo && !imagem) throw new AppError('Informe titulo ou imagem para atualizar', 400);
    const row = await quizModel.update(id, titulo, imagem);
    if (!row) throw new AppError('Quiz nao encontrado', 404);
    return Quiz.fromRow(row);
  }

  async toggleStatus(id) {
    const row = await quizModel.toggleStatus(id);
    if (!row) throw new AppError('Quiz nao encontrado', 404);
    return Quiz.fromRow(row);
  }
}

module.exports = new QuizController();

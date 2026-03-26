const quizModel = require('../models/quiz.model');
const Quiz = require('../entities/quiz.entity');
const { AppError } = require('../middlewares');

class QuizController {
  async getById(id) {
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    const row = await quizModel.findById(id);
    if (!row) throw new AppError('Quiz nao encontrado', 404);
    return Quiz.fromRow(row);
  }

  async getAll(skip, take) {
    if (isNaN(parseInt(skip)) || isNaN(parseInt(take))) throw new AppError('Parâmetros skip/take inválidos', 400);
    const rows = await quizModel.findAll(skip, take);
    return Quiz.fromRows(rows);
  }

  async getByCurso(cursoId, skip, take) {
    if (isNaN(parseInt(cursoId)) || isNaN(parseInt(skip)) || isNaN(parseInt(take))) throw new AppError('Parâmetros inválidos', 400);
    const rows = await quizModel.findByCurso(cursoId, skip, take);
    return Quiz.fromRows(rows);
  }

  async getByUsuarioAndCurso(userId, cursoId, skip, take, avaliativo) {
    if (isNaN(parseInt(userId)) || isNaN(parseInt(cursoId)) || isNaN(parseInt(skip)) || isNaN(parseInt(take))) throw new AppError('Parâmetros inválidos', 400);
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
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    if (!titulo && !imagem) throw new AppError('Informe titulo ou imagem para atualizar', 400);
    const row = await quizModel.update(id, titulo, imagem);
    if (!row) throw new AppError('Quiz nao encontrado', 404);
    return Quiz.fromRow(row);
  }

  async toggleStatus(id) {
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    const row = await quizModel.toggleStatus(id);
    if (!row) throw new AppError('Quiz nao encontrado', 404);
    return Quiz.fromRow(row);
  }
}

module.exports = new QuizController();

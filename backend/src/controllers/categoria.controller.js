const categoriaModel = require('../models/categoria.model');
const Categoria = require('../entities/categoria.entity');
const { AppError } = require('../middlewares');

class CategoriaController {
  async getById(id) {
    const row = await categoriaModel.findById(id);
    if (!row) throw new AppError('Categoria nao encontrada', 404);
    return Categoria.fromRow(row);
  }

  async getByCurso(cursoId) {
    const rows = await categoriaModel.findByCurso(cursoId);
    return Categoria.fromRows(rows);
  }

  async getByQuiz(quizId) {
    const rows = await categoriaModel.findByQuiz(quizId);
    return Categoria.fromRows(rows);
  }

  async create(descricao, cursoId, imagem) {
    if (await categoriaModel.existsByNameAndCurso(descricao, cursoId)) throw new AppError('Categoria ja existe', 400);
    const row = await categoriaModel.create(descricao, cursoId, imagem);
    return Categoria.fromRow(row);
  }

  async update(id, descricao, imagem) {
    const row = await categoriaModel.update(id, descricao, imagem);
    if (!row) throw new AppError('Categoria nao encontrada', 404);
    return Categoria.fromRow(row);
  }

  async toggleStatus(id) {
    const row = await categoriaModel.toggleStatus(id);
    if (!row) throw new AppError('Categoria nao encontrada', 404);
    return Categoria.fromRow(row);
  }
}

module.exports = new CategoriaController();

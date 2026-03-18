const perguntaModel = require('../models/pergunta.model');
const alternativaModel = require('../models/alternativa.model');
const progressoModel = require('../models/progresso.model');
const Pergunta = require('../entities/pergunta.entity');
const { AppError } = require('../middlewares');

class PerguntaController {
  async getById(id) {
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    const row = await perguntaModel.findById(id);
    if (!row) throw new AppError('Pergunta nao encontrada', 404);
    return Pergunta.fromRow(row);
  }

  async getAll() {
    const rows = await perguntaModel.findAll();
    return this._attachAlternativas(rows);
  }

  async getCompletas(categoriaId, activeOnly) {
    const rows = await perguntaModel.findByCategoria(categoriaId, activeOnly);
    return this._attachAlternativas(rows);
  }

  async getByQuiz(quizId, filters = {}) {
    let excludeIds = [];
    if (filters.userId) {
      excludeIds = await progressoModel.findAnsweredIds(filters.userId);
    }
    const rows = await perguntaModel.findByQuiz(quizId, { ...filters, excludeIds });
    return Pergunta.fromRows(rows);
  }

  async create(data) {
    if (!data.categoriasid) throw new AppError('Campo categoriasid é obrigatório', 400);
    const row = await perguntaModel.create(data);
    const pergunta = Pergunta.fromRow(row);

    if (data.alternativas && Array.isArray(data.alternativas) && data.alternativas.length > 0) {
      for (const a of data.alternativas) {
        await alternativaModel.create({
          perguntasid: pergunta.id,
          conteudo: a.conteudo || a.text || null,
          imagem: a.imagem || null,
          correta: a.correta ?? a.isCorrect ?? false,
        });
      }
    }
    return pergunta;
  }

  async update(id, data) {
    const fields = {};
    for (const k of ['conteudo','perguntasnivelid','tempo','pathimage','categoriasid','quizid','status']) {
      if (data[k] !== undefined) fields[k] = data[k];
    }

    if (Object.keys(fields).length === 0 && !data.alternativas) throw new AppError('Nada para atualizar', 400);

    if (Object.keys(fields).length > 0) {
      await perguntaModel.update(id, fields);
    }

    if (data.alternativas && Array.isArray(data.alternativas)) {
      await alternativaModel.deleteByPergunta(id);
      for (const a of data.alternativas) {
        await alternativaModel.create({
          perguntasid: id,
          conteudo: a.conteudo || a.text || null,
          imagem: a.imagem || null,
          correta: a.correta ?? a.isCorrect ?? false,
        });
      }
    }

    const row = await perguntaModel.findById(id);
    if (!row) throw new AppError('Pergunta nao encontrada', 404);
    return Pergunta.fromRow(row);
  }

  async toggleStatus(id) {
    const row = await perguntaModel.toggleStatus(id);
    if (!row) throw new AppError('Pergunta nao encontrada', 404);
    return Pergunta.fromRow(row);
  }

  async delete(id) {
    const ok = await perguntaModel.delete(id);
    if (!ok) throw new AppError('Pergunta nao encontrada', 404);
  }

  async _attachAlternativas(perguntas) {
    const ids = perguntas.map(p => p.id);
    const alts = await alternativaModel.findByPerguntaIds(ids);
    const altMap = {};
    for (const a of alts) { (altMap[a.perguntasid] = altMap[a.perguntasid] || []).push(a); }
    return perguntas.map(p => Pergunta.fromRow({ ...p, alternativas: altMap[p.id] || [] }));
  }
}

module.exports = new PerguntaController();

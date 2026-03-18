const alternativaModel = require('../models/alternativa.model');
const Alternativa = require('../entities/alternativa.entity');
const { AppError } = require('../middlewares');

class AlternativaController {
  async getByPergunta(perguntaId) {
    const rows = await alternativaModel.findByPergunta(perguntaId);
    return Alternativa.fromRows(rows);
  }

  async create(body) {
    const items = Array.isArray(body) ? body : [body];
    const perguntaId = items[0].perguntasid;
    if (!perguntaId) throw new AppError('Campo perguntasid é obrigatório', 400);

    const count = await alternativaModel.countByPergunta(perguntaId);
    if (count + items.length > 5) throw new AppError('Limite de alternativas excedido (máx 5)', 400);

    if (!Array.isArray(body)) {
      const existing = await alternativaModel.findByPergunta(perguntaId);
      if (body.conteudo && existing.some(a => a.conteudo === body.conteudo)) throw new AppError('Alternativa ja existe', 400);
      if (body.correta && existing.some(a => a.correta)) throw new AppError('Nao pode existir mais de uma alternativa correta', 400);
    }

    const results = [];
    for (const a of items) {
      const row = await alternativaModel.create(a);
      results.push(Alternativa.fromRow(row));
    }
    return Array.isArray(body) ? results : results[0];
  }

  async update(id, data) {
    const row = await alternativaModel.update(id, data);
    if (!row) throw new AppError('Alternativa nao encontrada', 404);
    return Alternativa.fromRow(row);
  }

  async delete(id) {
    const ok = await alternativaModel.delete(id);
    if (!ok) throw new AppError('Alternativa nao encontrada', 404);
  }
}

module.exports = new AlternativaController();

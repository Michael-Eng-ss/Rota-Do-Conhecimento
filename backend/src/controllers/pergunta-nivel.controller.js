const perguntaNivelModel = require('../models/pergunta-nivel.model');
const PerguntaNivel = require('../entities/pergunta-nivel.entity');
const { AppError } = require('../middlewares');

class PerguntaNivelController {
  async getAll() {
    const rows = await perguntaNivelModel.findAll();
    return PerguntaNivel.fromRows(rows);
  }

  async getById(id) {
    const row = await perguntaNivelModel.findById(id);
    if (!row) throw new AppError('Nivel nao encontrado', 404);
    return PerguntaNivel.fromRow(row);
  }
}

module.exports = new PerguntaNivelController();

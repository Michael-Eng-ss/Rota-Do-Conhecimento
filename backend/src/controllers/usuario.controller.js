const { hashPassword } = require('../auth-utils');
const usuarioModel = require('../models/usuario.model');
const Usuario = require('../entities/usuario.entity');
const { AppError } = require('../middlewares');

class UsuarioController {
  async getById(id) {
    const row = await usuarioModel.findById(id);
    if (!row) throw new AppError('Usuario nao encontrado', 404);
    return Usuario.fromRow(row).toSafeJSON();
  }

  async create(data) {
    const existing = await usuarioModel.findByEmail(data.email);
    if (existing) throw new AppError('Email ja cadastrado', 400);

    const row = await usuarioModel.create({ ...data, senha: hashPassword(data.senha) });
    return Usuario.fromRow(row).toSafeJSON();
  }

  async update(id, updates) {
    if (Object.keys(updates).length === 0) throw new AppError('Nada para atualizar', 400);
    const row = await usuarioModel.update(id, updates);
    if (!row) throw new AppError('Usuario nao encontrado', 404);
    return Usuario.fromRow(row).toSafeJSON();
  }

  async updatePassword(id, senha) {
    const ok = await usuarioModel.updatePassword(id, hashPassword(senha));
    if (!ok) throw new AppError('Usuario nao encontrado', 404);
    return { message: 'success' };
  }

  async updateScore(id, pontuacao) {
    const row = await usuarioModel.findById(id);
    if (!row) throw new AppError('Usuario nao encontrado', 404);
    const newScore = (row.pontuacao || 0) + pontuacao;
    const updated = await usuarioModel.updateScore(id, newScore);
    return Usuario.fromRow(updated).toSafeJSON();
  }

  async getRanking(cursoId) {
    return usuarioModel.getRanking(cursoId);
  }

  async findByCurso(cursoId, skip, take) {
    return usuarioModel.findByCurso(cursoId, skip, take);
  }
}

module.exports = new UsuarioController();

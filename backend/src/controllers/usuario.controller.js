const { hashPassword } = require('../auth-utils');
const usuarioModel = require('../models/usuario.model');
const Usuario = require('../entities/usuario.entity');
const { AppError } = require('../middlewares');
const emailTokensModel = require('../models/email_tokens.model');
const { sendEmailConfirmation } = require('../services/email.service');

class UsuarioController {
  async getById(id) {
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    const row = await usuarioModel.findById(id);
    if (!row) throw new AppError('Usuario nao encontrado', 404);
    return Usuario.fromRow(row).toSafeJSON();
  }

  async create(data) {
    const existing = await usuarioModel.findByEmail(data.email);
    if (existing) throw new AppError('Email ja cadastrado', 400);

    const row = await usuarioModel.create({ ...data, senha: hashPassword(data.senha) });

    // Dispara e-mail de confirmação de cadastro em background (não bloqueia a resposta)
    emailTokensModel.create(row.id, 'confirm_email', 1440)
      .then(token => sendEmailConfirmation(row.email, row.nome, token))
      .catch(err => console.error('[Email] Falha ao enviar confirmação:', err));

    return Usuario.fromRow(row).toSafeJSON();
  }

  async update(id, updates) {
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    if (Object.keys(updates).length === 0) throw new AppError('Nada para atualizar', 400);
    const row = await usuarioModel.update(id, updates);
    if (!row) throw new AppError('Usuario nao encontrado', 404);
    return Usuario.fromRow(row).toSafeJSON();
  }

  async updatePassword(id, senha) {
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    const ok = await usuarioModel.updatePassword(id, hashPassword(senha));
    if (!ok) throw new AppError('Usuario nao encontrado', 404);
    return { message: 'success' };
  }

  async updateScore(id, pontuacao) {
    if (isNaN(parseInt(id))) throw new AppError('ID inválido', 400);
    const row = await usuarioModel.findById(id);
    if (!row) throw new AppError('Usuario nao encontrado', 404);
    const newScore = (row.pontuacao || 0) + pontuacao;
    const updated = await usuarioModel.updateScore(id, newScore);
    return Usuario.fromRow(updated).toSafeJSON();
  }

  async getRanking(cursoId) {
    if (isNaN(parseInt(cursoId))) throw new AppError('Curso ID inválido', 400);
    return usuarioModel.getRanking(cursoId);
  }

  async findByCurso(cursoId, skip, take) {
    if (isNaN(parseInt(cursoId)) || isNaN(parseInt(skip)) || isNaN(parseInt(take))) throw new AppError('Parâmetros inválidos', 400);
    return usuarioModel.findByCurso(cursoId, skip, take);
  }
}

module.exports = new UsuarioController();

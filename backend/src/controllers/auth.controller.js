const { hashPassword, createToken } = require('../auth-utils');
const usuarioModel = require('../models/usuario.model');
const logModel = require('../models/log.model');
const Usuario = require('../entities/usuario.entity');
const { AppError } = require('../middlewares');
const emailTokensModel = require('../models/email_tokens.model');
const { sendEmailConfirmation, sendPasswordReset } = require('../services/email.service');

class AuthController {
  async login(email, senha) {
    const row = await usuarioModel.findByEmail(email);
    if (!row) throw new AppError('Email e/ou Senha Incorretos', 401);

    const user = Usuario.fromRow(row);
    const hashed = hashPassword(senha);
    if (user.senha !== hashed) throw new AppError('Email e/ou Senha Incorretos', 401);

    const token = createToken({ id: user.id, name: user.nome, role: user.role });
    await logModel.create(user.id, 'Login successfully');

    return { token, id: user.id, role: user.role, user: user.toSafeJSON() };
  }

  /** Gera token e envia e-mail de confirmação de cadastro */
  async sendEmailConfirmation(email) {
    const row = await usuarioModel.findByEmail(email);
    if (!row) throw new AppError('Email não encontrado', 404);
    if (row.email_verified) throw new AppError('Email já confirmado', 400);

    const token = await emailTokensModel.create(row.id, 'confirm_email', 1440); // 24h
    await sendEmailConfirmation(email, row.nome, token);
    return { message: 'E-mail de confirmação enviado!' };
  }

  /** Valida o token de confirmação e marca o usuário como verificado */
  async confirmEmail(token) {
    const record = await emailTokensModel.findValid(token, 'confirm_email');
    if (!record) throw new AppError('Link inválido ou expirado', 400);

    await usuarioModel.markEmailVerified(record.usuario_id);
    await emailTokensModel.markUsed(token);
    return { message: 'E-mail confirmado com sucesso!' };
  }

  /** Gera token e envia e-mail de reset de senha */
  async forgotPassword(email) {
    const row = await usuarioModel.findByEmail(email);
    // Resposta genérica para não revelar existência do e-mail
    if (!row) return { message: 'Se o e-mail existir, você receberá as instruções.' };

    const token = await emailTokensModel.create(row.id, 'reset_password', 60); // 1h
    await sendPasswordReset(email, row.nome, token);
    return { message: 'Se o e-mail existir, você receberá as instruções.' };
  }

  /** Valida o token de reset e atualiza a senha */
  async resetPassword(token, novaSenha) {
    const record = await emailTokensModel.findValid(token, 'reset_password');
    if (!record) throw new AppError('Link inválido ou expirado', 400);

    await usuarioModel.updatePassword(record.usuario_id, hashPassword(novaSenha));
    await emailTokensModel.markUsed(token);
    return { message: 'Senha atualizada com sucesso!' };
  }
}

module.exports = new AuthController();

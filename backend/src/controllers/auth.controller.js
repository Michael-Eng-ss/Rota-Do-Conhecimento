const { hashPassword, createToken } = require('../auth-utils');
const usuarioModel = require('../models/usuario.model');
const logModel = require('../models/log.model');
const Usuario = require('../entities/usuario.entity');
const { AppError } = require('../middlewares');

class AuthController {
  async login(email, senha) {
    const row = await usuarioModel.findByEmail(email);
    if (!row) throw new AppError('Email e/ou Senha Incorretos', 401);

    const user = Usuario.fromRow(row);
    const hashed = hashPassword(senha);
    if (user.senha !== hashed) throw new AppError('Email e/ou Senha Incorretos', 401);

    const token = createToken({ id: user.id, name: user.nome, role: user.role });
    await logModel.create(user.id, 'Login successfully');

    return { token, id: user.id, role: user.role };
  }
}

module.exports = new AuthController();

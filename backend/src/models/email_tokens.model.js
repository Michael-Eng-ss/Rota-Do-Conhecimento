const { pool } = require('../db');
const crypto = require('crypto');

class EmailTokensModel {
  /**
   * Gera um token único e salva no banco.
   * @param {number} usuarioId
   * @param {'confirm_email'|'reset_password'} tipo
   * @param {number} expiresInMinutes
   */
  async create(usuarioId, tipo, expiresInMinutes = 60) {
    const token = crypto.randomBytes(32).toString('hex');
    const expira_em = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    // Invalida tokens anteriores do mesmo tipo para o mesmo usuário
    await pool.query(
      'UPDATE email_tokens SET usado=true WHERE usuario_id=$1 AND tipo=$2 AND usado=false',
      [usuarioId, tipo]
    );

    await pool.query(
      'INSERT INTO email_tokens (usuario_id, token, tipo, expira_em) VALUES ($1,$2,$3,$4)',
      [usuarioId, token, tipo, expira_em]
    );

    return token;
  }

  /**
   * Busca e valida um token. Retorna null se inválido/expirado/já usado.
   * @param {string} token
   * @param {'confirm_email'|'reset_password'} tipo
   */
  async findValid(token, tipo) {
    const { rows } = await pool.query(
      `SELECT * FROM email_tokens
       WHERE token=$1 AND tipo=$2 AND usado=false AND expira_em > NOW()`,
      [token, tipo]
    );
    return rows[0] || null;
  }

  /** Marca o token como usado */
  async markUsed(token) {
    await pool.query('UPDATE email_tokens SET usado=true WHERE token=$1', [token]);
  }
}

module.exports = new EmailTokensModel();

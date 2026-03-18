const router = require('express').Router();
const { pool } = require('../../db');
const { hashPassword, createToken } = require('../../auth-utils');
const { asyncHandler, validateBody, AppError } = require('../../middlewares');

// POST / - Login
router.post('/', validateBody({ email: 'string', senha: 'string' }), asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) throw new AppError('Email e/ou Senha Incorretos', 401);

  const hashed = hashPassword(senha);
  if (user.senha !== hashed) throw new AppError('Email e/ou Senha Incorretos', 401);

  const token = createToken({ id: user.id, name: user.nome, role: user.role });
  await pool.query('INSERT INTO logs (usuariosid, descricao) VALUES ($1, $2)', [user.id, 'Login successfully']);

  res.json({ token, id: user.id, role: user.role });
}));

module.exports = router;

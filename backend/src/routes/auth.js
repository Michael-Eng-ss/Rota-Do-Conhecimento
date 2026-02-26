const router = require('express').Router();
const { pool } = require('../db');
const { hashPassword, createToken } = require('../auth-utils');

router.post('/', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: 'Email e senha são obrigatórios' });

    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Email e/ou Senha Incorretos' });

    const hashed = hashPassword(senha);
    if (user.senha !== hashed) return res.status(401).json({ message: 'Email e/ou Senha Incorretos' });

    const token = createToken({ id: user.id, name: user.nome, role: user.role });

    await pool.query('INSERT INTO logs (usuariosid, descricao) VALUES ($1, $2)', [user.id, 'Login successfully']);

    res.json({ token, id: user.id, role: user.role });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Internal Error' });
  }
});

module.exports = router;

const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler } = require('../../middlewares');

// POST /
router.post('/', asyncHandler(async (req, res) => {
  const b = req.body;
  if (b.pontuacao < 0) return res.status(400).json({ message: 'A pontuacao nao pode ser negativa' });
  const { rows: existing } = await pool.query('SELECT id FROM quiz_avaliativo_usuario WHERE quizid=$1 AND usuarioid=$2', [b.quizid, b.usuarioid]);
  if (existing.length > 0) return res.status(400).json({ message: 'Pontuacao ja existe' });
  const { rows } = await pool.query(
    'INSERT INTO quiz_avaliativo_usuario (quizid,usuarioid,pontuacao,horainicial,horafinal) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [b.quizid, b.usuarioid, b.pontuacao, b.horainicial||new Date().toISOString(), b.horafinal||new Date().toISOString()]
  );
  res.status(201).json(rows[0]);
}));

// GET /quiz/:quizId/:skip/:take
router.get('/quiz/:quizId/:skip/:take', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quiz_avaliativo_usuario WHERE quizid=$1 LIMIT $2 OFFSET $3',
    [req.params.quizId, req.params.take, req.params.skip]);
  res.json(rows);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quiz_avaliativo_usuario WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Pontuacao nao encontrada' });
  res.json(rows[0]);
}));

module.exports = router;

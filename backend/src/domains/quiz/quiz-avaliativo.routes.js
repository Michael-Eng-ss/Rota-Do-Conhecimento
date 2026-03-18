const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, AppError } = require('../../middlewares');

// POST /
router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const b = req.body;
  if (!b.quizid || !b.usuarioid) throw new AppError('Campos quizid e usuarioid são obrigatórios', 400);
  if (b.pontuacao < 0) throw new AppError('A pontuacao nao pode ser negativa', 400);

  const { rows: existing } = await pool.query('SELECT id FROM quiz_avaliativo_usuario WHERE quizid=$1 AND usuarioid=$2', [b.quizid, b.usuarioid]);
  if (existing.length > 0) throw new AppError('Pontuacao ja existe para este quiz e usuario', 400);

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
  if (!rows[0]) throw new AppError('Pontuacao nao encontrada', 404);
  res.json(rows[0]);
}));

module.exports = router;

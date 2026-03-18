const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole, validateBody, AppError } = require('../../middlewares');

// POST /
router.post('/', requireAuth, requireRole(1), validateBody({ descricao: 'string' }), asyncHandler(async (req, res) => {
  const b = req.body;
  if (!b.cursoId) throw new AppError('Campo cursoId é obrigatório', 400);
  const { rows: existing } = await pool.query('SELECT id FROM categorias WHERE descricao=$1 AND "cursoId"=$2', [b.descricao, b.cursoId]);
  if (existing.length > 0) throw new AppError('Categoria ja existe', 400);
  const { rows } = await pool.query('INSERT INTO categorias (descricao,imagem,"cursoId") VALUES ($1,$2,$3) RETURNING *', [b.descricao, b.imagem||'', b.cursoId]);
  res.status(201).json(rows[0]);
}));

// GET /curso/:cursoId
router.get('/curso/:cursoId', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categorias WHERE "cursoId"=$1 AND status=true', [req.params.cursoId]);
  res.json(rows);
}));

// GET /quiz/:quizId
router.get('/quiz/:quizId', asyncHandler(async (req, res) => {
  const { rows: perguntas } = await pool.query('SELECT DISTINCT categoriasid FROM perguntas WHERE quizid=$1', [req.params.quizId]);
  const catIds = perguntas.map(p => p.categoriasid);
  if (catIds.length === 0) return res.json([]);
  const { rows } = await pool.query('SELECT * FROM categorias WHERE id = ANY($1)', [catIds]);
  res.json(rows);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categorias WHERE id=$1', [req.params.id]);
  if (!rows[0]) throw new AppError('Categoria nao encontrada', 404);
  res.json(rows[0]);
}));

// PUT /:id/status
router.put('/:id/status', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const { rows: [existing] } = await pool.query('SELECT status FROM categorias WHERE id=$1', [req.params.id]);
  if (!existing) throw new AppError('Categoria nao encontrada', 404);
  const { rows } = await pool.query('UPDATE categorias SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, req.params.id]);
  res.json(rows[0]);
}));

// PUT /:id
router.put('/:id', requireAuth, requireRole(1), validateBody({ descricao: 'string' }), asyncHandler(async (req, res) => {
  const { rows } = await pool.query('UPDATE categorias SET descricao=$1, imagem=$2 WHERE id=$3 RETURNING *', [req.body.descricao, req.body.imagem, req.params.id]);
  if (!rows[0]) throw new AppError('Categoria nao encontrada', 404);
  res.json(rows[0]);
}));

module.exports = router;

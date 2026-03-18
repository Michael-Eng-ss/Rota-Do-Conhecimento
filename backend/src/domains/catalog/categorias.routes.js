const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole } = require('../../middlewares');

router.post('/', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const b = req.body;
  const { rows: existing } = await pool.query('SELECT id FROM categorias WHERE descricao=$1 AND "cursoId"=$2', [b.descricao, b.cursoId]);
  if (existing.length > 0) return res.status(400).json({ message: 'Categoria ja existe' });
  const { rows } = await pool.query('INSERT INTO categorias (descricao,imagem,"cursoId") VALUES ($1,$2,$3) RETURNING *', [b.descricao, b.imagem||'', b.cursoId]);
  res.status(201).json(rows[0]);
}));

router.get('/curso/:cursoId', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categorias WHERE "cursoId"=$1 AND status=true', [req.params.cursoId]);
  res.json(rows);
}));

router.get('/quiz/:quizId', asyncHandler(async (req, res) => {
  const { rows: perguntas } = await pool.query('SELECT DISTINCT categoriasid FROM perguntas WHERE quizid=$1', [req.params.quizId]);
  const catIds = perguntas.map(p => p.categoriasid);
  if (catIds.length === 0) return res.json([]);
  const { rows } = await pool.query('SELECT * FROM categorias WHERE id = ANY($1)', [catIds]);
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categorias WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Categoria nao encontrada' });
  res.json(rows[0]);
}));

router.put('/:id/status', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const { rows: [existing] } = await pool.query('SELECT status FROM categorias WHERE id=$1', [req.params.id]);
  if (!existing) return res.status(404).json({ message: 'Categoria nao encontrada' });
  const { rows } = await pool.query('UPDATE categorias SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, req.params.id]);
  res.json(rows[0]);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('UPDATE categorias SET descricao=$1, imagem=$2 WHERE id=$3 RETURNING *', [req.body.descricao, req.body.imagem, req.params.id]);
  res.json(rows[0]);
}));

module.exports = router;

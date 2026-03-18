const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole, validateBody, AppError } = require('../../middlewares');

// POST /
router.post('/', requireAuth, requireRole(1), validateBody({ titulo: 'string' }), asyncHandler(async (req, res) => {
  const b = req.body;
  if (!b.cursoid) throw new AppError('Campo cursoid é obrigatório', 400);
  if (!b.usuarioid) throw new AppError('Campo usuarioid é obrigatório', 400);

  const { rows } = await pool.query(
    'INSERT INTO quiz (titulo,cursoid,imagem,status,avaliativo,usuarioid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [b.titulo, b.cursoid, b.imagem||'', b.status??true, b.avaliativo??false, b.usuarioid]
  );
  res.status(201).json(rows[0]);
}));

// GET /curso/:cursoId/:skip/:take
router.get('/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quiz WHERE cursoid=$1 LIMIT $2 OFFSET $3', [req.params.cursoId, req.params.take, req.params.skip]);
  res.json(rows);
}));

// GET /usuario/:userId/curso/:cursoId/:skip/:take
router.get('/usuario/:userId/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quiz WHERE cursoid=$1 AND usuarioid=$2 LIMIT $3 OFFSET $4',
    [req.params.cursoId, req.params.userId, req.params.take, req.params.skip]);
  res.json(rows);
}));

// GET /avaliativo/usuario/:userId/curso/:cursoId/:skip/:take
router.get('/avaliativo/usuario/:userId/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quiz WHERE cursoid=$1 AND usuarioid=$2 AND avaliativo=true LIMIT $3 OFFSET $4',
    [req.params.cursoId, req.params.userId, req.params.take, req.params.skip]);
  res.json(rows);
}));

// GET /:skip/:take
router.get('/:skip/:take', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quiz LIMIT $1 OFFSET $2', [req.params.take, req.params.skip]);
  res.json(rows);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM quiz WHERE id=$1', [req.params.id]);
  if (!rows[0]) throw new AppError('Quiz nao encontrado', 404);
  res.json(rows[0]);
}));

// PUT /:id/status
router.put('/:id/status', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const { rows: [existing] } = await pool.query('SELECT status FROM quiz WHERE id=$1', [req.params.id]);
  if (!existing) throw new AppError('Quiz nao encontrado', 404);
  const { rows } = await pool.query('UPDATE quiz SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, req.params.id]);
  res.json(rows[0]);
}));

// PUT /:id
router.put('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const b = req.body;
  if (!b.titulo && !b.imagem) throw new AppError('Informe titulo ou imagem para atualizar', 400);
  const { rows } = await pool.query('UPDATE quiz SET titulo=$1, imagem=$2 WHERE id=$3 RETURNING *', [b.titulo, b.imagem, req.params.id]);
  if (!rows[0]) throw new AppError('Quiz nao encontrado', 404);
  res.json(rows[0]);
}));

module.exports = router;

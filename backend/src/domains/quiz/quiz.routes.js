const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole } = require('../../middlewares');

// POST /
router.post('/', asyncHandler(async (req, res) => {
  const b = req.body;
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
  if (!rows[0]) return res.status(404).json({ message: 'Quiz nao encontrado' });
  res.json(rows[0]);
}));

// PUT /:id/status
router.put('/:id/status', asyncHandler(async (req, res) => {
  const { rows: [existing] } = await pool.query('SELECT status FROM quiz WHERE id=$1', [req.params.id]);
  if (!existing) return res.status(404).json({ message: 'Quiz nao encontrado' });
  const { rows } = await pool.query('UPDATE quiz SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, req.params.id]);
  res.json(rows[0]);
}));

// PUT /:id
router.put('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('UPDATE quiz SET titulo=$1, imagem=$2 WHERE id=$3 RETURNING *', [req.body.titulo, req.body.imagem, req.params.id]);
  res.json(rows[0]);
}));

module.exports = router;

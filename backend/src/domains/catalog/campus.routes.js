const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole, validateBody, AppError } = require('../../middlewares');

// GET /
router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM campus');
  res.json(rows);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM campus WHERE id=$1', [req.params.id]);
  if (!rows[0]) throw new AppError('Campus nao encontrado', 404);
  res.json(rows[0]);
}));

// POST /
router.post('/', requireAuth, requireRole(1), validateBody({ nomecampus: 'string' }), asyncHandler(async (req, res) => {
  const { rows: existing } = await pool.query('SELECT id FROM campus WHERE nomecampus=$1', [req.body.nomecampus]);
  if (existing.length > 0) throw new AppError('Campus ja existe', 400);
  const { rows } = await pool.query('INSERT INTO campus (nomecampus) VALUES ($1) RETURNING *', [req.body.nomecampus]);
  res.status(201).json(rows[0]);
}));

// PUT /:id
router.put('/:id', requireAuth, requireRole(1), validateBody({ nomecampus: 'string' }), asyncHandler(async (req, res) => {
  const { rows } = await pool.query('UPDATE campus SET nomecampus=$1 WHERE id=$2 RETURNING *', [req.body.nomecampus, req.params.id]);
  if (!rows[0]) throw new AppError('Campus nao encontrado', 404);
  res.json(rows[0]);
}));

// DELETE /:id
router.delete('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM campus WHERE id=$1', [req.params.id]);
  if (rowCount === 0) throw new AppError('Campus nao encontrado', 404);
  res.status(204).send();
}));

module.exports = router;

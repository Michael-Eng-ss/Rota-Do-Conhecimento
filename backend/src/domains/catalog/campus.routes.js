const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole } = require('../../middlewares');

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM campus');
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM campus WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Campus nao encontrado' });
  res.json(rows[0]);
}));

router.post('/', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const { rows: existing } = await pool.query('SELECT id FROM campus WHERE nomecampus=$1', [req.body.nomecampus]);
  if (existing.length > 0) return res.status(400).json({ message: 'Campus ja existe' });
  const { rows } = await pool.query('INSERT INTO campus (nomecampus) VALUES ($1) RETURNING *', [req.body.nomecampus]);
  res.status(201).json(rows[0]);
}));

router.put('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const { rows } = await pool.query('UPDATE campus SET nomecampus=$1 WHERE id=$2 RETURNING *', [req.body.nomecampus, req.params.id]);
  res.json(rows[0]);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM campus WHERE id=$1', [req.params.id]);
  res.status(204).send();
}));

module.exports = router;

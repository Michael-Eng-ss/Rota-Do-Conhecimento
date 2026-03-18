const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler } = require('../../middlewares');

// GET /
router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM perguntasnivel');
  res.json(rows);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM perguntasnivel WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Nivel nao encontrado' });
  res.json(rows[0]);
}));

module.exports = router;

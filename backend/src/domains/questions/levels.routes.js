const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, AppError } = require('../../middlewares');

// GET /
router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM perguntasnivel');
  res.json(rows);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM perguntasnivel WHERE id=$1', [req.params.id]);
  if (!rows[0]) throw new AppError('Nivel nao encontrado', 404);
  res.json(rows[0]);
}));

module.exports = router;

const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler } = require('../../middlewares');

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM curso');
  res.json(rows);
}));

module.exports = router;

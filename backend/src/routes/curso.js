const router = require('express').Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM curso'); res.json(rows); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

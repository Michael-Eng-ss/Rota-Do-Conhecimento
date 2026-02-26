const router = require('express').Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM perguntasnivel'); res.json(rows); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM perguntasnivel WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Nivel nao encontrado' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

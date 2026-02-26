const router = require('express').Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM campus'); res.json(rows); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM campus WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Campus nao encontrado' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT id FROM campus WHERE nomecampus=$1', [req.body.nomecampus]);
    if (existing.length > 0) return res.status(400).json({ message: 'Campus ja existe' });
    const { rows } = await pool.query('INSERT INTO campus (nomecampus) VALUES ($1) RETURNING *', [req.body.nomecampus]);
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('UPDATE campus SET nomecampus=$1 WHERE id=$2 RETURNING *', [req.body.nomecampus, req.params.id]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try { await pool.query('DELETE FROM campus WHERE id=$1', [req.params.id]); res.status(204).send(); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

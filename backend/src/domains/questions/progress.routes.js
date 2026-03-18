const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth } = require('../../middlewares');

// POST /
router.post('/', asyncHandler(async (req, res) => {
  const body = req.body;
  const items = Array.isArray(body) ? body : [body];
  const userId = items[0].usuariosid;

  const { rows: existing } = await pool.query('SELECT perguntasid FROM progressoperguntas WHERE usuariosid=$1', [userId]);
  const existingIds = new Set(existing.map(p => p.perguntasid));

  const results = [];
  for (const item of items) {
    if (existingIds.has(item.perguntasid)) return res.status(400).json({ message: 'Progresso ja existe' });
    const { rows } = await pool.query(
      'INSERT INTO progressoperguntas (usuariosid,perguntasid) VALUES ($1,$2) RETURNING *',
      [item.usuariosid, item.perguntasid]
    );
    results.push(rows[0]);
    existingIds.add(item.perguntasid);
  }
  res.status(201).json(Array.isArray(body) ? results : results[0]);
}));

// GET /quiz/:quizId/usuario/:userId
router.get('/quiz/:quizId/usuario/:userId', asyncHandler(async (req, res) => {
  const { rows: perguntas } = await pool.query('SELECT id FROM perguntas WHERE quizid=$1', [req.params.quizId]);
  const ids = perguntas.map(p => p.id);
  if (ids.length === 0) return res.json([]);
  const { rows } = await pool.query('SELECT * FROM progressoperguntas WHERE usuariosid=$1 AND perguntasid = ANY($2)', [req.params.userId, ids]);
  res.json(rows);
}));

// GET /categoria/:catId/quiz/:quizId/usuario/:userId
router.get('/categoria/:catId/quiz/:quizId/usuario/:userId', asyncHandler(async (req, res) => {
  const { rows: perguntas } = await pool.query('SELECT id FROM perguntas WHERE quizid=$1 AND categoriasid=$2', [req.params.quizId, req.params.catId]);
  const ids = perguntas.map(p => p.id);
  if (ids.length === 0) return res.json([]);
  const { rows } = await pool.query('SELECT * FROM progressoperguntas WHERE usuariosid=$1 AND perguntasid = ANY($2)', [req.params.userId, ids]);
  res.json(rows);
}));

module.exports = router;

const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole, AppError } = require('../../middlewares');

// GET /pergunta/:perguntaId
router.get('/pergunta/:perguntaId', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM alternativas WHERE perguntasid=$1', [req.params.perguntaId]);
  res.json(rows);
}));

// POST /
router.post('/', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const body = req.body;
  const items = Array.isArray(body) ? body : [body];
  const perguntaId = items[0].perguntasid;
  if (!perguntaId) throw new AppError('Campo perguntasid é obrigatório', 400);

  const { rows: existing } = await pool.query('SELECT id,conteudo,correta FROM alternativas WHERE perguntasid=$1', [perguntaId]);
  if (existing.length + items.length > 5) throw new AppError('Limite de alternativas excedido (máx 5)', 400);

  if (!Array.isArray(body)) {
    if (body.conteudo && existing.some(a => a.conteudo === body.conteudo)) throw new AppError('Alternativa ja existe', 400);
    if (body.correta && existing.some(a => a.correta)) throw new AppError('Nao pode existir mais de uma alternativa correta', 400);
  }

  const results = [];
  for (const a of items) {
    const { rows } = await pool.query(
      'INSERT INTO alternativas (perguntasid,conteudo,imagem,correta) VALUES ($1,$2,$3,$4) RETURNING *',
      [a.perguntasid, a.conteudo||null, a.imagem||null, a.correta||false]
    );
    results.push(rows[0]);
  }
  res.status(201).json(Array.isArray(body) ? results : results[0]);
}));

// PUT /:id
router.put('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const b = req.body;
  const { rows } = await pool.query(
    'UPDATE alternativas SET conteudo=$1, imagem=$2, correta=$3 WHERE id=$4 RETURNING *',
    [b.conteudo, b.imagem, b.correta, req.params.id]
  );
  if (!rows[0]) throw new AppError('Alternativa nao encontrada', 404);
  res.json(rows[0]);
}));

// DELETE /:id
router.delete('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM alternativas WHERE id=$1', [req.params.id]);
  if (rowCount === 0) throw new AppError('Alternativa nao encontrada', 404);
  res.status(204).send();
}));

module.exports = router;

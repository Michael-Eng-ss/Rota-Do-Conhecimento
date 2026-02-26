const router = require('express').Router();
const { pool } = require('../db');

// GET /pergunta/:perguntaId
router.get('/pergunta/:perguntaId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alternativas WHERE perguntasid=$1', [req.params.perguntaId]);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const items = Array.isArray(body) ? body : [body];
    const perguntaId = items[0].perguntasid;

    const { rows: existing } = await pool.query('SELECT id,conteudo,correta FROM alternativas WHERE perguntasid=$1', [perguntaId]);
    if (existing.length + items.length > 5) return res.status(400).json({ message: 'Limite de alternativas excedido' });

    if (!Array.isArray(body)) {
      if (body.conteudo && existing.some(a => a.conteudo === body.conteudo)) return res.status(400).json({ message: 'Alternativa ja existe' });
      if (body.correta && existing.some(a => a.correta)) return res.status(400).json({ message: 'Nao pode existir mais de uma alternativa correta' });
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
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /:id
router.put('/:id', async (req, res) => {
  try {
    const b = req.body;
    const { rows } = await pool.query(
      'UPDATE alternativas SET conteudo=$1, imagem=$2, correta=$3 WHERE id=$4 RETURNING *',
      [b.conteudo, b.imagem, b.correta, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM alternativas WHERE id=$1', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

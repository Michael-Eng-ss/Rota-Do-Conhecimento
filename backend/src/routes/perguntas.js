const router = require('express').Router();
const { pool } = require('../db');

// GET /completas/:categoriaId
router.get('/completas/:categoriaId', async (req, res) => {
  try {
    const catId = req.params.categoriaId;
    const activeOnly = req.query.active !== 'false';
    let q = 'SELECT * FROM perguntas WHERE categoriasid=$1';
    const params = [catId];
    if (activeOnly) q += ' AND status=true';
    const { rows: perguntas } = await pool.query(q, params);

    const ids = perguntas.map(p => p.id);
    let alts = [];
    if (ids.length > 0) {
      const { rows } = await pool.query('SELECT * FROM alternativas WHERE perguntasid = ANY($1)', [ids]);
      alts = rows;
    }
    const altMap = {};
    for (const a of alts) { (altMap[a.perguntasid] = altMap[a.perguntasid] || []).push(a); }
    res.json(perguntas.map(p => ({ ...p, alternativas: altMap[p.id] || [] })));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /todas
router.get('/todas', async (req, res) => {
  try {
    const { rows: perguntas } = await pool.query('SELECT * FROM perguntas ORDER BY id DESC');
    const ids = perguntas.map(p => p.id);
    let alts = [];
    if (ids.length > 0) {
      const { rows } = await pool.query('SELECT * FROM alternativas WHERE perguntasid = ANY($1)', [ids]);
      alts = rows;
    }
    const altMap = {};
    for (const a of alts) { (altMap[a.perguntasid] = altMap[a.perguntasid] || []).push(a); }
    res.json(perguntas.map(p => ({ ...p, alternativas: altMap[p.id] || [] })));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /quiz/:quizId/... (complex route)
router.get('/quiz/:quizId*', async (req, res) => {
  try {
    const parts = req.path.split('/').filter(Boolean);
    // parts: ["quiz", quizId, ...]
    const quizId = parseInt(parts[1]);
    let categoriaId, userId, skip = 0, take = 20;

    const catIdx = parts.indexOf('categoria');
    if (catIdx !== -1) categoriaId = parseInt(parts[catIdx + 1]);
    const uIdx = parts.indexOf('usuario');
    if (uIdx !== -1) {
      userId = parseInt(parts[uIdx + 1]);
      skip = parseInt(parts[uIdx + 2]) || 0;
      take = parseInt(parts[uIdx + 3]) || 20;
    } else if (categoriaId !== undefined) {
      skip = parseInt(parts[catIdx + 2]) || 0;
      take = parseInt(parts[catIdx + 3]) || 20;
    }

    let q = 'SELECT * FROM perguntas WHERE quizid=$1 AND status=true';
    const params = [quizId];
    let paramIdx = 2;

    if (categoriaId) { q += ` AND categoriasid=$${paramIdx}`; params.push(categoriaId); paramIdx++; }

    if (userId) {
      const { rows: prog } = await pool.query('SELECT perguntasid FROM progressoperguntas WHERE usuariosid=$1', [userId]);
      const answered = prog.map(p => p.perguntasid);
      if (answered.length > 0) { q += ` AND id != ALL($${paramIdx})`; params.push(answered); paramIdx++; }
    }

    q += ` LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
    params.push(take, skip);

    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /:id
router.get('/:id', async (req, res) => {
  try {
    if (isNaN(parseInt(req.params.id))) return res.status(404).json({ message: 'Not Found' });
    const { rows } = await pool.query('SELECT * FROM perguntas WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Pergunta nao encontrada' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /
router.post('/', async (req, res) => {
  try {
    const b = req.body;
    const { rows } = await pool.query(
      'INSERT INTO perguntas (conteudo,perguntasnivelid,tempo,pathimage,status,categoriasid,quizid) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [b.conteudo, b.perguntasnivelid||1, b.tempo||30, b.pathimage||null, b.status??true, b.categoriasid, b.quizid||null]
    );
    const pergunta = rows[0];

    if (b.alternativas && Array.isArray(b.alternativas) && b.alternativas.length > 0) {
      for (const a of b.alternativas) {
        await pool.query('INSERT INTO alternativas (perguntasid,conteudo,imagem,correta) VALUES ($1,$2,$3,$4)',
          [pergunta.id, a.conteudo||a.text||null, a.imagem||null, a.correta??a.isCorrect??false]);
      }
    }
    res.status(201).json(pergunta);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { rows: [existing] } = await pool.query('SELECT status FROM perguntas WHERE id=$1', [req.params.id]);
    if (!existing) return res.status(404).json({ message: 'Pergunta nao encontrada' });
    const { rows } = await pool.query('UPDATE perguntas SET status=$1 WHERE id=$2 RETURNING *', [!existing.status, req.params.id]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /:id
router.put('/:id', async (req, res) => {
  try {
    const b = req.body;
    const fields = []; const vals = []; let i = 1;
    for (const k of ['conteudo','perguntasnivelid','tempo','pathimage','categoriasid','quizid','status']) {
      if (b[k] !== undefined) { fields.push(`${k}=$${i}`); vals.push(b[k]); i++; }
    }
    if (fields.length > 0) {
      vals.push(req.params.id);
      await pool.query(`UPDATE perguntas SET ${fields.join(',')} WHERE id=$${i}`, vals);
    }

    if (b.alternativas && Array.isArray(b.alternativas)) {
      await pool.query('DELETE FROM alternativas WHERE perguntasid=$1', [req.params.id]);
      for (const a of b.alternativas) {
        await pool.query('INSERT INTO alternativas (perguntasid,conteudo,imagem,correta) VALUES ($1,$2,$3,$4)',
          [req.params.id, a.conteudo||a.text||null, a.imagem||null, a.correta??a.isCorrect??false]);
      }
    }

    const { rows } = await pool.query('SELECT * FROM perguntas WHERE id=$1', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM alternativas WHERE perguntasid=$1', [req.params.id]);
    await pool.query('DELETE FROM perguntas WHERE id=$1', [req.params.id]);
    res.status(204).send();
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;

const router = require('express').Router();
const { pool } = require('../../db');
const { hashPassword } = require('../../auth-utils');
const { asyncHandler, requireAuth } = require('../../middlewares');

// POST / - create user
router.post('/', asyncHandler(async (req, res) => {
  const b = req.body;
  const { rows: existing } = await pool.query('SELECT id FROM usuarios WHERE email = $1', [b.email]);
  if (existing.length > 0) return res.status(400).json({ message: 'Email ja cadastrado' });

  const hashed = hashPassword(b.senha);
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nome, email, senha, telefone, sexo, datanascimento, role, uf, foto, pontuacao, status, cidade, turma, periodo, cursoid, campusid)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [b.nome, b.email, hashed, b.telefone||'', b.sexo||0, b.datanascimento||new Date().toISOString(), b.role||3,
     b.uf||'', b.foto||'', b.pontuacao||0, b.status??true, b.cidade||'', b.turma||null, b.periodo||null, b.cursoid, b.campusid||null]
  );
  const { senha: _, ...safe } = rows[0];
  res.status(201).json(safe);
}));

// GET /ranking/:cursoId
router.get('/ranking/:cursoId', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, nome, foto, pontuacao FROM usuarios WHERE cursoid=$1 AND status=true ORDER BY pontuacao DESC',
    [req.params.cursoId]
  );
  res.json(rows);
}));

// GET /curso/:cursoId/:skip/:take
router.get('/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  const { cursoId, skip, take } = req.params;
  const { rows } = await pool.query(
    'SELECT id,nome,email,telefone,sexo,datanascimento,role,uf,foto,pontuacao,status,cidade,turma,periodo,cursoid,campusid FROM usuarios WHERE cursoid=$1 AND status=true LIMIT $2 OFFSET $3',
    [cursoId, take, skip]
  );
  res.json(rows);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Usuario nao encontrado' });
  const { senha: _, ...safe } = rows[0];
  res.json(safe);
}));

// PUT /:id
router.put('/:id', asyncHandler(async (req, res) => {
  const b = req.body;
  const fields = []; const vals = []; let i = 1;
  for (const k of ['nome','email','telefone','sexo','datanascimento','uf','foto','cidade','turma','periodo','cursoid','campusid']) {
    if (b[k] !== undefined) { fields.push(`${k}=$${i}`); vals.push(b[k]); i++; }
  }
  if (fields.length === 0) return res.status(400).json({ message: 'Nada para atualizar' });
  vals.push(req.params.id);
  const { rows } = await pool.query(`UPDATE usuarios SET ${fields.join(',')} WHERE id=$${i} RETURNING *`, vals);
  const { senha: _, ...safe } = rows[0];
  res.json(safe);
}));

// PUT /:id/senha
router.put('/:id/senha', asyncHandler(async (req, res) => {
  const hashed = hashPassword(req.body.senha);
  await pool.query('UPDATE usuarios SET senha=$1 WHERE id=$2', [hashed, req.params.id]);
  res.json({ message: 'success' });
}));

// PUT /:id/pontuacao
router.put('/:id/pontuacao', asyncHandler(async (req, res) => {
  const { rows: [user] } = await pool.query('SELECT pontuacao FROM usuarios WHERE id=$1', [req.params.id]);
  if (!user) return res.status(404).json({ message: 'Usuario nao encontrado' });
  const newPont = (user.pontuacao || 0) + req.body.pontuacao;
  const { rows } = await pool.query('UPDATE usuarios SET pontuacao=$1 WHERE id=$2 RETURNING *', [newPont, req.params.id]);
  const { senha: _, ...safe } = rows[0];
  res.json(safe);
}));

module.exports = router;

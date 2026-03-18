const router = require('express').Router();
const { pool } = require('../../db');
const { asyncHandler, requireAuth, requireRole } = require('../../middlewares');

router.get('/', asyncHandler(async (req, res) => {
  const { rows: logs } = await pool.query("SELECT datalogin, usuariosid FROM logs WHERE datalogin >= '2024-08-01' AND datalogin <= '2024-08-31'");
  const userIds = [...new Set(logs.map(l => l.usuariosid))];
  if (userIds.length === 0) return res.json([]);

  const { rows: usuarios } = await pool.query('SELECT id, sexo, cidade, datanascimento FROM usuarios WHERE id = ANY($1)', [userIds]);
  const userMap = new Map(usuarios.map(u => [u.id, u]));

  const reportMap = new Map();
  for (const log of logs) {
    const user = userMap.get(log.usuariosid);
    if (!user) continue;
    const hour = new Date(log.datalogin).getHours();
    let periodo;
    if (hour >= 7 && hour <= 11) periodo = 'Manhã';
    else if (hour >= 12 && hour <= 17) periodo = 'Tarde';
    else if (hour >= 18 && hour <= 23) periodo = 'Noite';
    else continue;

    const age = Math.floor((Date.now() - new Date(user.datanascimento).getTime()) / (365.25*24*60*60*1000));
    const key = `${user.sexo}_${user.cidade}`;
    if (!reportMap.has(key)) {
      reportMap.set(key, { sexo: user.sexo, cidade: user.cidade, quantidade_manha:0, quantidade_tarde:0, quantidade_noite:0, idade_15_19:0, idade_20_24:0, idade_25_29:0, idade_30_34:0, idade_35_mais:0 });
    }
    const e = reportMap.get(key);
    if (periodo==='Manhã') e.quantidade_manha++;
    else if (periodo==='Tarde') e.quantidade_tarde++;
    else e.quantidade_noite++;
    if (age>=15&&age<=19) e.idade_15_19++;
    else if (age>=20&&age<=24) e.idade_20_24++;
    else if (age>=25&&age<=29) e.idade_25_29++;
    else if (age>=30&&age<=34) e.idade_30_34++;
    else if (age>=35) e.idade_35_mais++;
  }
  res.json([...reportMap.values()]);
}));

module.exports = router;

const { pool } = require('../db');

const SAFE_COLUMNS = 'id,nome,email,telefone,sexo,datanascimento,role,uf,foto,pontuacao,status,cidade,turma,periodo,cursoid,campusid';
const UPDATABLE_FIELDS = ['nome','email','telefone','sexo','datanascimento','uf','foto','cidade','turma','periodo','cursoid','campusid'];

class UsuarioModel {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id=$1', [id]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
    return rows[0] || null;
  }

  async create(data) {
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome,email,senha,telefone,sexo,datanascimento,role,uf,foto,pontuacao,status,cidade,turma,periodo,cursoid,campusid)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [data.nome, data.email, data.senha, data.telefone||'', data.sexo||0, data.datanascimento||new Date().toISOString(),
       data.role||3, data.uf||'', data.foto||'', data.pontuacao||0, data.status??true, data.cidade||'',
       data.turma||null, data.periodo||null, data.cursoid||null, data.campusid||null]
    );
    return rows[0];
  }

  async update(id, updates) {
    const fields = []; const vals = []; let i = 1;
    for (const k of UPDATABLE_FIELDS) {
      if (updates[k] !== undefined) { fields.push(`${k}=$${i}`); vals.push(updates[k]); i++; }
    }
    if (fields.length === 0) return null;
    vals.push(id);
    const { rows } = await pool.query(`UPDATE usuarios SET ${fields.join(',')} WHERE id=$${i} RETURNING *`, vals);
    return rows[0] || null;
  }

  async updatePassword(id, hashedPassword) {
    const { rowCount } = await pool.query('UPDATE usuarios SET senha=$1 WHERE id=$2', [hashedPassword, id]);
    return rowCount > 0;
  }

  async updateScore(id, newScore) {
    const { rows } = await pool.query('UPDATE usuarios SET pontuacao=$1 WHERE id=$2 RETURNING *', [newScore, id]);
    return rows[0] || null;
  }

  async getRanking(cursoId) {
    const { rows } = await pool.query(
      'SELECT id, nome, foto, pontuacao FROM usuarios WHERE cursoid=$1 AND status=true ORDER BY pontuacao DESC',
      [cursoId]
    );
    return rows;
  }

  async findByCurso(cursoId, skip, take) {
    const { rows } = await pool.query(
      `SELECT ${SAFE_COLUMNS} FROM usuarios WHERE cursoid=$1 AND status=true LIMIT $2 OFFSET $3`,
      [cursoId, take, skip]
    );
    return rows;
  }
}

module.exports = new UsuarioModel();

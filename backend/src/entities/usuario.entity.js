// Usuario Entity
class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.senha = data.senha;
    this.role = data.role;
    this.pontuacao = data.pontuacao;
    this.foto = data.foto;
    this.cursoid = data.cursoid;
    this.campusid = data.campusid;
    this.cidade = data.cidade;
    this.uf = data.uf;
    this.telefone = data.telefone;
    this.sexo = data.sexo;
    this.turma = data.turma;
    this.periodo = data.periodo;
    this.datanascimento = data.datanascimento;
    this.status = data.status;
  }

  static fromRow(row) {
    return new Usuario(row);
  }

  static fromRows(rows) {
    return rows.map(Usuario.fromRow);
  }

  get isAdmin() {
    return this.role === 1;
  }

  /** Retorna objeto sem a senha */
  toSafeJSON() {
    const { senha, ...safe } = this.toJSON();
    return safe;
  }

  toJSON() {
    return {
      id: this.id, nome: this.nome, email: this.email, senha: this.senha,
      role: this.role, pontuacao: this.pontuacao, foto: this.foto,
      cursoid: this.cursoid, campusid: this.campusid, cidade: this.cidade,
      uf: this.uf, telefone: this.telefone, sexo: this.sexo, turma: this.turma,
      periodo: this.periodo, datanascimento: this.datanascimento, status: this.status,
    };
  }
}

module.exports = Usuario;

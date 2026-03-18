// Curso Entity
class Curso {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.imagem = data.imagem || '';
  }

  static fromRow(row) {
    return new Curso(row);
  }

  static fromRows(rows) {
    return rows.map(Curso.fromRow);
  }

  toJSON() {
    return { id: this.id, nome: this.nome, imagem: this.imagem };
  }
}

module.exports = Curso;

// Categoria Entity
class Categoria {
  constructor(data) {
    this.id = data.id;
    this.descricao = data.descricao;
    this.imagem = data.imagem || '';
    this.status = data.status;
    this.cursoId = data.cursoId;
  }

  static fromRow(row) {
    return new Categoria(row);
  }

  static fromRows(rows) {
    return rows.map(Categoria.fromRow);
  }

  toJSON() {
    return { id: this.id, descricao: this.descricao, imagem: this.imagem, status: this.status, cursoId: this.cursoId };
  }
}

module.exports = Categoria;

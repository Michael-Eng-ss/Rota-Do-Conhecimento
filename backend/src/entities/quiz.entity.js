// Quiz Entity
class Quiz {
  constructor(data) {
    this.id = data.id;
    this.titulo = data.titulo;
    this.imagem = data.imagem || '';
    this.avaliativo = data.avaliativo;
    this.status = data.status;
    this.cursoid = data.cursoid;
    this.usuarioid = data.usuarioid;
  }

  static fromRow(row) {
    return new Quiz(row);
  }

  static fromRows(rows) {
    return rows.map(Quiz.fromRow);
  }

  toJSON() {
    return {
      id: this.id, titulo: this.titulo, imagem: this.imagem, avaliativo: this.avaliativo,
      status: this.status, cursoid: this.cursoid, usuarioid: this.usuarioid,
    };
  }
}

module.exports = Quiz;

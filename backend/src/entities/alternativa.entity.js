// Alternativa Entity
class Alternativa {
  constructor(data) {
    this.id = data.id;
    this.conteudo = data.conteudo;
    this.imagem = data.imagem;
    this.correta = data.correta;
    this.perguntasid = data.perguntasid;
  }

  static fromRow(row) {
    return new Alternativa(row);
  }

  static fromRows(rows) {
    return rows.map(Alternativa.fromRow);
  }

  toJSON() {
    return { id: this.id, conteudo: this.conteudo, imagem: this.imagem, correta: this.correta, perguntasid: this.perguntasid };
  }
}

module.exports = Alternativa;

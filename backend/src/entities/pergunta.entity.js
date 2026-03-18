// Pergunta Entity
class Pergunta {
  constructor(data) {
    this.id = data.id;
    this.conteudo = data.conteudo;
    this.perguntasnivelid = data.perguntasnivelid;
    this.tempo = data.tempo;
    this.pathimage = data.pathimage;
    this.status = data.status;
    this.categoriasid = data.categoriasid;
    this.quizid = data.quizid;
    this.alternativas = data.alternativas || [];
  }

  static fromRow(row) {
    return new Pergunta(row);
  }

  static fromRows(rows) {
    return rows.map(Pergunta.fromRow);
  }

  toJSON() {
    const obj = {
      id: this.id, conteudo: this.conteudo, perguntasnivelid: this.perguntasnivelid,
      tempo: this.tempo, pathimage: this.pathimage, status: this.status,
      categoriasid: this.categoriasid, quizid: this.quizid,
    };
    if (this.alternativas.length > 0) obj.alternativas = this.alternativas;
    return obj;
  }
}

module.exports = Pergunta;

// ProgressoPerguntas Entity
class ProgressoPerguntas {
  constructor(data) {
    this.id = data.id;
    this.usuariosid = data.usuariosid;
    this.perguntasid = data.perguntasid;
  }

  static fromRow(row) {
    return new ProgressoPerguntas(row);
  }

  static fromRows(rows) {
    return rows.map(ProgressoPerguntas.fromRow);
  }

  toJSON() {
    return { id: this.id, usuariosid: this.usuariosid, perguntasid: this.perguntasid };
  }
}

module.exports = ProgressoPerguntas;

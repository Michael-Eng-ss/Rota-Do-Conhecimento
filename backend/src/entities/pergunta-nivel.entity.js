// PerguntaNivel Entity
class PerguntaNivel {
  constructor(data) {
    this.id = data.id;
    this.nivel = data.nivel;
    this.pontuacao = data.pontuacao;
    this.tempo = data.tempo;
  }

  static fromRow(row) {
    return new PerguntaNivel(row);
  }

  static fromRows(rows) {
    return rows.map(PerguntaNivel.fromRow);
  }

  toJSON() {
    return { id: this.id, nivel: this.nivel, pontuacao: this.pontuacao, tempo: this.tempo };
  }
}

module.exports = PerguntaNivel;

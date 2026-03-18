// QuizAvaliativoUsuario Entity
class QuizAvaliativoUsuario {
  constructor(data) {
    this.id = data.id;
    this.usuarioid = data.usuarioid;
    this.quizid = data.quizid;
    this.pontuacao = data.pontuacao;
    this.horainicial = data.horainicial;
    this.horafinal = data.horafinal;
  }

  static fromRow(row) {
    return new QuizAvaliativoUsuario(row);
  }

  static fromRows(rows) {
    return rows.map(QuizAvaliativoUsuario.fromRow);
  }

  toJSON() {
    return {
      id: this.id, usuarioid: this.usuarioid, quizid: this.quizid,
      pontuacao: this.pontuacao, horainicial: this.horainicial, horafinal: this.horafinal,
    };
  }
}

module.exports = QuizAvaliativoUsuario;

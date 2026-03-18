// Log Entity
class Log {
  constructor(data) {
    this.id = data.id;
    this.usuariosid = data.usuariosid;
    this.datalogin = data.datalogin;
    this.descricao = data.descricao;
  }

  static fromRow(row) {
    return new Log(row);
  }

  static fromRows(rows) {
    return rows.map(Log.fromRow);
  }

  toJSON() {
    return { id: this.id, usuariosid: this.usuariosid, datalogin: this.datalogin, descricao: this.descricao };
  }
}

module.exports = Log;

// Campus Entity
class Campus {
  constructor(data) {
    this.id = data.id;
    this.nomecampus = data.nomecampus;
  }

  static fromRow(row) {
    return new Campus(row);
  }

  static fromRows(rows) {
    return rows.map(Campus.fromRow);
  }

  toJSON() {
    return { id: this.id, nomecampus: this.nomecampus };
  }
}

module.exports = Campus;

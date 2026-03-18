const cursoModel = require('../models/curso.model');
const Curso = require('../entities/curso.entity');

class CursoController {
  async getAll() {
    const rows = await cursoModel.findAll();
    return Curso.fromRows(rows);
  }
}

module.exports = new CursoController();

const campusModel = require('../models/campus.model');
const Campus = require('../entities/campus.entity');
const { AppError } = require('../middlewares');

class CampusController {
  async getAll() {
    const rows = await campusModel.findAll();
    return Campus.fromRows(rows);
  }

  async getById(id) {
    const row = await campusModel.findById(id);
    if (!row) throw new AppError('Campus nao encontrado', 404);
    return Campus.fromRow(row);
  }

  async create(nomecampus) {
    if (await campusModel.existsByName(nomecampus)) throw new AppError('Campus ja existe', 400);
    const row = await campusModel.create(nomecampus);
    return Campus.fromRow(row);
  }

  async update(id, nomecampus) {
    const row = await campusModel.update(id, nomecampus);
    if (!row) throw new AppError('Campus nao encontrado', 404);
    return Campus.fromRow(row);
  }

  async delete(id) {
    const ok = await campusModel.delete(id);
    if (!ok) throw new AppError('Campus nao encontrado', 404);
  }
}

module.exports = new CampusController();

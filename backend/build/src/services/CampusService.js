"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampusService = void 0;
const CampusRepository_1 = require("../repositories/CampusRepository");
const AppError_1 = require("../shared/AppError");
class CampusService {
    constructor(dataSource) {
        this.campusRepo = new CampusRepository_1.CampusRepository(dataSource);
    }
    async getAll() {
        return this.campusRepo.findAll();
    }
    async getById(id) {
        const campus = await this.campusRepo.findById(id);
        if (!campus)
            throw AppError_1.AppError.notFound('Campus não encontrado');
        return campus;
    }
    async create(nome) {
        if (await this.campusRepo.existsByName(nome)) {
            throw AppError_1.AppError.conflict('Campus já cadastrado com este nome');
        }
        return this.campusRepo.create(nome);
    }
    async update(id, nome) {
        const existing = await this.campusRepo.findById(id);
        if (!existing)
            throw AppError_1.AppError.notFound('Campus não encontrado');
        const updated = await this.campusRepo.update(id, nome);
        if (!updated)
            throw AppError_1.AppError.notFound('Campus não encontrado');
        return updated;
    }
    async delete(id) {
        const ok = await this.campusRepo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Campus não encontrado');
        return { message: 'Campus removido com sucesso' };
    }
}
exports.CampusService = CampusService;
//# sourceMappingURL=CampusService.js.map
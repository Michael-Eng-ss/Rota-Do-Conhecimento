"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoService = void 0;
const CursoRepository_1 = require("../repositories/CursoRepository");
const AppError_1 = require("../shared/AppError");
class CursoService {
    constructor(dataSource) {
        this.repo = new CursoRepository_1.CursoRepository(dataSource);
    }
    getAll() {
        return this.repo.findAll();
    }
    async getById(id) {
        const c = await this.repo.findById(id);
        if (!c)
            throw AppError_1.AppError.notFound('Curso não encontrado');
        return c;
    }
    create(data) {
        if (!data.nome?.trim())
            throw AppError_1.AppError.badRequest('Nome do curso é obrigatório');
        return this.repo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        const updated = await this.repo.update(id, data);
        if (!updated)
            throw AppError_1.AppError.notFound('Curso não encontrado');
        return updated;
    }
    async delete(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Curso não encontrado');
        return { message: 'Curso removido com sucesso' };
    }
}
exports.CursoService = CursoService;
//# sourceMappingURL=CursoService.js.map
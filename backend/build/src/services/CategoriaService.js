"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaService = void 0;
const CategoriaRepository_1 = require("../repositories/CategoriaRepository");
const AppError_1 = require("../shared/AppError");
class CategoriaService {
    constructor(dataSource) {
        this.repo = new CategoriaRepository_1.CategoriaRepository(dataSource);
    }
    getAll() {
        return this.repo.findAll();
    }
    getByCurso(cursoid) {
        return this.repo.findByCurso(cursoid);
    }
    async getById(id) {
        const c = await this.repo.findById(id);
        if (!c)
            throw AppError_1.AppError.notFound('Categoria não encontrada');
        return c;
    }
    create(data) {
        if (!data.descricao?.trim())
            throw AppError_1.AppError.badRequest('Descrição da categoria é obrigatória');
        if (!data.cursoid)
            throw AppError_1.AppError.badRequest('Curso é obrigatório');
        return this.repo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        const updated = await this.repo.update(id, data);
        if (!updated)
            throw AppError_1.AppError.notFound('Categoria não encontrada');
        return updated;
    }
    async delete(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Categoria não encontrada');
        return { message: 'Categoria removida com sucesso' };
    }
}
exports.CategoriaService = CategoriaService;
//# sourceMappingURL=CategoriaService.js.map
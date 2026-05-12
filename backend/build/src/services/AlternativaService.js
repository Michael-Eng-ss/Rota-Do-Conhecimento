"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativaService = void 0;
const AlternativaRepository_1 = require("../repositories/AlternativaRepository");
const AppError_1 = require("../shared/AppError");
class AlternativaService {
    constructor(dataSource) {
        this.repo = new AlternativaRepository_1.AlternativaRepository(dataSource);
    }
    getByPergunta(perguntasid) {
        return this.repo.findByPergunta(perguntasid);
    }
    async getById(id) {
        const a = await this.repo.findById(id);
        if (!a)
            throw AppError_1.AppError.notFound('Alternativa não encontrada');
        return a;
    }
    create(data) {
        if (!data.perguntasid)
            throw AppError_1.AppError.badRequest('ID da pergunta é obrigatório');
        return this.repo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        const updated = await this.repo.update(id, data);
        if (!updated)
            throw AppError_1.AppError.notFound('Alternativa não encontrada');
        return updated;
    }
    async delete(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Alternativa não encontrada');
        return { message: 'Alternativa removida com sucesso' };
    }
}
exports.AlternativaService = AlternativaService;
//# sourceMappingURL=AlternativaService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaNivelService = void 0;
const PerguntaNivelRepository_1 = require("../repositories/PerguntaNivelRepository");
const AppError_1 = require("../shared/AppError");
class PerguntaNivelService {
    constructor(dataSource) {
        this.repo = new PerguntaNivelRepository_1.PerguntaNivelRepository(dataSource);
    }
    getAll() {
        return this.repo.findAll();
    }
    async getById(id) {
        const n = await this.repo.findById(id);
        if (!n)
            throw AppError_1.AppError.notFound('Nível não encontrado');
        return n;
    }
    create(data) {
        if (data.nivel === undefined)
            throw AppError_1.AppError.badRequest('Nível é obrigatório');
        if (data.pontuacao === undefined)
            throw AppError_1.AppError.badRequest('Pontuação é obrigatória');
        if (data.tempo === undefined)
            throw AppError_1.AppError.badRequest('Tempo é obrigatório');
        return this.repo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        const updated = await this.repo.update(id, data);
        if (!updated)
            throw AppError_1.AppError.notFound('Nível não encontrado');
        return updated;
    }
    async delete(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Nível não encontrado');
        return { message: 'Nível removido com sucesso' };
    }
}
exports.PerguntaNivelService = PerguntaNivelService;
//# sourceMappingURL=PerguntaNivelService.js.map
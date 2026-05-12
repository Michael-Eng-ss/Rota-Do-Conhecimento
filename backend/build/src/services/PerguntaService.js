"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaService = void 0;
const PerguntaRepository_1 = require("../repositories/PerguntaRepository");
const AppError_1 = require("../shared/AppError");
class PerguntaService {
    constructor(dataSource) {
        this.repo = new PerguntaRepository_1.PerguntaRepository(dataSource);
    }
    getAll() {
        return this.repo.findAll();
    }
    async getById(id) {
        const p = await this.repo.findById(id);
        if (!p)
            throw AppError_1.AppError.notFound('Pergunta não encontrada');
        return p;
    }
    getCompletas(categoriasid, activeOnly) {
        return this.repo.findCompletasByCategoria(categoriasid, activeOnly);
    }
    create(data) {
        if (!data.conteudo?.trim())
            throw AppError_1.AppError.badRequest('Conteúdo da pergunta é obrigatório');
        if (!data.categoriasid)
            throw AppError_1.AppError.badRequest('Categoria é obrigatória');
        if (!data.perguntasnivelid)
            throw AppError_1.AppError.badRequest('Nível da pergunta é obrigatório');
        return this.repo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        const updated = await this.repo.update(id, data);
        if (!updated)
            throw AppError_1.AppError.notFound('Pergunta não encontrada');
        return updated;
    }
    async delete(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Pergunta não encontrada');
        return { message: 'Pergunta removida com sucesso' };
    }
}
exports.PerguntaService = PerguntaService;
//# sourceMappingURL=PerguntaService.js.map
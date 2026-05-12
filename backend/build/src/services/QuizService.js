"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const QuizRepository_1 = require("../repositories/QuizRepository");
const AppError_1 = require("../shared/AppError");
class QuizService {
    constructor(dataSource) {
        this.repo = new QuizRepository_1.QuizRepository(dataSource);
    }
    getAll() {
        return this.repo.findAll();
    }
    getByCurso(cursoid) {
        return this.repo.findByCurso(cursoid);
    }
    async getById(id) {
        const q = await this.repo.findById(id);
        if (!q)
            throw AppError_1.AppError.notFound('Quiz não encontrado');
        return q;
    }
    create(data) {
        if (!data.titulo?.trim())
            throw AppError_1.AppError.badRequest('Título do quiz é obrigatório');
        if (!data.cursoid)
            throw AppError_1.AppError.badRequest('Curso é obrigatório');
        if (!data.usuarioid)
            throw AppError_1.AppError.badRequest('Usuário criador é obrigatório');
        return this.repo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        const updated = await this.repo.update(id, data);
        if (!updated)
            throw AppError_1.AppError.notFound('Quiz não encontrado');
        return updated;
    }
    async delete(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Quiz não encontrado');
        return { message: 'Quiz removido com sucesso' };
    }
}
exports.QuizService = QuizService;
//# sourceMappingURL=QuizService.js.map
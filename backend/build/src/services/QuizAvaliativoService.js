"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAvaliativoService = void 0;
const QuizAvaliativoRepository_1 = require("../repositories/QuizAvaliativoRepository");
const AppError_1 = require("../shared/AppError");
class QuizAvaliativoService {
    constructor(dataSource) {
        this.repo = new QuizAvaliativoRepository_1.QuizAvaliativoRepository(dataSource);
    }
    getByUsuario(usuarioid) {
        return this.repo.findByUsuario(usuarioid);
    }
    getByQuiz(quizid) {
        return this.repo.findByQuiz(quizid);
    }
    async getById(id) {
        const r = await this.repo.findById(id);
        if (!r)
            throw AppError_1.AppError.notFound('Resultado não encontrado');
        return r;
    }
    create(data) {
        if (!data.quizid)
            throw AppError_1.AppError.badRequest('ID do quiz é obrigatório');
        if (!data.usuarioid)
            throw AppError_1.AppError.badRequest('ID do usuário é obrigatório');
        return this.repo.create(data);
    }
    async delete(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Resultado não encontrado');
        return { message: 'Resultado removido com sucesso' };
    }
}
exports.QuizAvaliativoService = QuizAvaliativoService;
//# sourceMappingURL=QuizAvaliativoService.js.map
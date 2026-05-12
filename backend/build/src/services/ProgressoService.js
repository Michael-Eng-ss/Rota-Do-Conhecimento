"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressoService = void 0;
const ProgressoRepository_1 = require("../repositories/ProgressoRepository");
const PerguntaRepository_1 = require("../repositories/PerguntaRepository");
const AppError_1 = require("../shared/AppError");
class ProgressoService {
    constructor(dataSource) {
        this.repo = new ProgressoRepository_1.ProgressoRepository(dataSource);
        this.perguntaRepo = new PerguntaRepository_1.PerguntaRepository(dataSource);
    }
    getByUsuario(usuariosid) {
        return this.repo.findByUsuario(usuariosid);
    }
    /**
     * Retorna o progresso do usuário para as perguntas de um quiz (quizid).
     * Primeiro busca os ids das perguntas do quiz, depois filtra o progresso.
     */
    async getByQuizAndUsuario(quizid, usuariosid) {
        const perguntas = await this.perguntaRepo.findAll();
        const ids = perguntas
            .filter((p) => p.quizid === quizid)
            .map((p) => p.id);
        if (ids.length === 0)
            return [];
        return this.repo.findByQuizAndUsuario(ids, usuariosid);
    }
    /**
     * Retorna o progresso do usuário para as perguntas de uma categoria dentro de um quiz.
     */
    async getByCategQuizAndUsuario(categoriasid, quizid, usuariosid) {
        const perguntas = await this.perguntaRepo.findAll();
        const ids = perguntas
            .filter((p) => p.categoriasid === categoriasid && p.quizid === quizid)
            .map((p) => p.id);
        if (ids.length === 0)
            return [];
        return this.repo.findByQuizAndUsuario(ids, usuariosid);
    }
    create(data) {
        if (!data.usuariosid)
            throw AppError_1.AppError.badRequest('ID do usuário é obrigatório');
        if (!data.perguntasid)
            throw AppError_1.AppError.badRequest('ID da pergunta é obrigatório');
        return this.repo.create(data);
    }
}
exports.ProgressoService = ProgressoService;
//# sourceMappingURL=ProgressoService.js.map
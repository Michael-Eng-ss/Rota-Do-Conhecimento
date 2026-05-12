"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAvaliativoRepository = void 0;
const QuizAvalativoUsuario_1 = require("../entities/QuizAvalativoUsuario");
class QuizAvaliativoRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(QuizAvalativoUsuario_1.QuizAvalativoUsuario);
    }
    findByUsuario(usuarioid) {
        return this.repo.find({ where: { usuarioid }, order: { id: 'DESC' } });
    }
    findByQuiz(quizid) {
        return this.repo.find({ where: { quizid }, order: { pontuacao: 'DESC' } });
    }
    findById(id) {
        return this.repo.findOneBy({ id });
    }
    create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async delete(id) {
        const result = await this.repo.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
exports.QuizAvaliativoRepository = QuizAvaliativoRepository;
//# sourceMappingURL=QuizAvaliativoRepository.js.map
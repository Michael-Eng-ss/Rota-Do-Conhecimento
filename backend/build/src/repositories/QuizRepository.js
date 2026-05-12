"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRepository = void 0;
const Quiz_1 = require("../entities/Quiz");
class QuizRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Quiz_1.Quiz);
    }
    findAll() {
        return this.repo.find({ order: { id: 'ASC' } });
    }
    findById(id) {
        return this.repo.findOneBy({ id });
    }
    findByCurso(cursoid) {
        return this.repo.find({ where: { cursoid }, order: { id: 'ASC' } });
    }
    create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async update(id, data) {
        await this.repo.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repo.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
exports.QuizRepository = QuizRepository;
//# sourceMappingURL=QuizRepository.js.map
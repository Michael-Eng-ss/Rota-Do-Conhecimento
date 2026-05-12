"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativaRepository = void 0;
const Alternativa_1 = require("../entities/Alternativa");
class AlternativaRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Alternativa_1.Alternativa);
    }
    findByPergunta(perguntasid) {
        return this.repo.find({ where: { perguntasid }, order: { id: 'ASC' } });
    }
    findById(id) {
        return this.repo.findOneBy({ id });
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
exports.AlternativaRepository = AlternativaRepository;
//# sourceMappingURL=AlternativaRepository.js.map
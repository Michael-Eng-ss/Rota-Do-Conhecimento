"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaNivelRepository = void 0;
const PerguntaNivel_1 = require("../entities/PerguntaNivel");
class PerguntaNivelRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(PerguntaNivel_1.PerguntaNivel);
    }
    findAll() {
        return this.repo.find({ order: { nivel: 'ASC' } });
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
exports.PerguntaNivelRepository = PerguntaNivelRepository;
//# sourceMappingURL=PerguntaNivelRepository.js.map
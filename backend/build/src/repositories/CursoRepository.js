"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoRepository = void 0;
const Curso_1 = require("../entities/Curso");
class CursoRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Curso_1.Curso);
    }
    findAll() {
        return this.repo.find({ order: { nome: 'ASC' } });
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
exports.CursoRepository = CursoRepository;
//# sourceMappingURL=CursoRepository.js.map
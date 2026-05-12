"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaRepository = void 0;
const Categoria_1 = require("../entities/Categoria");
class CategoriaRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Categoria_1.Categoria);
    }
    findAll() {
        return this.repo.find({ order: { descricao: 'ASC' } });
    }
    findByCurso(cursoid) {
        return this.repo.find({ where: { cursoid }, order: { descricao: 'ASC' } });
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
exports.CategoriaRepository = CategoriaRepository;
//# sourceMappingURL=CategoriaRepository.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampusRepository = void 0;
const Campus_1 = require("../entities/Campus");
class CampusRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Campus_1.Campus);
    }
    async findAll() {
        return this.repo.find({ order: { nome: 'ASC' } });
    }
    async findById(id) {
        return this.repo.findOneBy({ id });
    }
    async create(nome) {
        const entity = this.repo.create({ nome });
        return this.repo.save(entity);
    }
    async update(id, nome) {
        await this.repo.update(id, { nome });
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repo.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async existsByName(nome) {
        return (await this.repo.count({ where: { nome } })) > 0;
    }
}
exports.CampusRepository = CampusRepository;
//# sourceMappingURL=CampusRepository.js.map
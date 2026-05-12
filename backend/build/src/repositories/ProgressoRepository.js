"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressoRepository = void 0;
const Progresso_1 = require("../entities/Progresso");
class ProgressoRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Progresso_1.Progresso);
    }
    findByUsuario(usuariosid) {
        return this.repo.find({ where: { usuariosid }, order: { id: 'ASC' } });
    }
    findByQuizAndUsuario(perguntasids, usuariosid) {
        return this.repo
            .createQueryBuilder('pp')
            .where('pp.usuariosid = :usuariosid', { usuariosid })
            .andWhere('pp.perguntasid IN (:...ids)', { ids: perguntasids })
            .getMany();
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
exports.ProgressoRepository = ProgressoRepository;
//# sourceMappingURL=ProgressoRepository.js.map
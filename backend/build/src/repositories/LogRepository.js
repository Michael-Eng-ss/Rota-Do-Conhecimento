"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRepository = void 0;
const Log_1 = require("../entities/Log");
class LogRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Log_1.Log);
    }
    async create(usuariosId, acao) {
        const entity = this.repo.create({ usuariosId, acao });
        return this.repo.save(entity);
    }
    async findByDateRange(start, end) {
        return this.repo
            .createQueryBuilder('log')
            .where('log.dataLogin BETWEEN :start AND :end', { start, end })
            .orderBy('log.dataLogin', 'DESC')
            .getMany();
    }
    async findByUser(usuariosId, limit = 50) {
        return this.repo.find({
            where: { usuariosId },
            order: { dataLogin: 'DESC' },
            take: limit,
        });
    }
}
exports.LogRepository = LogRepository;
//# sourceMappingURL=LogRepository.js.map
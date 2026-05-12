"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerguntaRepository = void 0;
const Pergunta_1 = require("../entities/Pergunta");
class PerguntaRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Pergunta_1.Pergunta);
    }
    findAll() {
        return this.repo.find({ order: { id: 'ASC' } });
    }
    findById(id) {
        return this.repo.findOneBy({ id });
    }
    /** Retorna perguntas de uma categoria com alternativas (join completo). */
    findCompletasByCategoria(categoriasid, activeOnly) {
        const qb = this.repo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.alternativas', 'a')
            .leftJoinAndSelect('p.nivel', 'n')
            .where('p.categoriasid = :categoriasid', { categoriasid });
        if (activeOnly)
            qb.andWhere('p.status = true');
        // Aleatorizar na camada de banco
        qb.orderBy('RANDOM()');
        return qb.getMany();
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
exports.PerguntaRepository = PerguntaRepository;
//# sourceMappingURL=PerguntaRepository.js.map
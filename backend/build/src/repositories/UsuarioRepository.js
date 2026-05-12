"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepository = void 0;
const Usuario_1 = require("../entities/Usuario");
class UsuarioRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(Usuario_1.Usuario);
    }
    // ── Leitura ───────────────────────────────────────────────────────────────
    /** Busca por e-mail, incluindo a senha (select: false). */
    async findByEmailWithPassword(email) {
        return this.repo
            .createQueryBuilder('u')
            .addSelect('u.senha')
            .where('u.email = :email', { email })
            .getOne();
    }
    async findById(id) {
        return this.repo.findOneBy({ id });
    }
    async findByIdWithRelations(id) {
        return this.repo.findOne({
            where: { id },
            relations: ['campus', 'curso'],
        });
    }
    async findByCampus(campusId) {
        return this.repo.find({ where: { campusId, status: true } });
    }
    async findByCurso(cursoId, skip = 0, take = 20) {
        return this.repo.find({
            where: { cursoId, status: true },
            skip,
            take,
        });
    }
    async findAll() {
        return this.repo.find({ where: { status: true } });
    }
    // ── Ranking ───────────────────────────────────────────────────────────────
    async findRankingByCurso(cursoId, limit = 50) {
        return this.repo.find({
            where: { cursoId, status: true },
            select: ['id', 'nome', 'foto', 'pontuacao', 'campusId', 'cursoId'],
            order: { pontuacao: 'DESC' },
            take: limit,
        });
    }
    async findRankingByCampus(campusId, limit = 50) {
        return this.repo.find({
            where: { campusId, status: true },
            select: ['id', 'nome', 'foto', 'pontuacao', 'campusId', 'cursoId'],
            order: { pontuacao: 'DESC' },
            take: limit,
        });
    }
    async findGlobalRanking(limit = 100) {
        return this.repo.find({
            where: { status: true },
            select: ['id', 'nome', 'foto', 'pontuacao', 'campusId', 'cursoId'],
            order: { pontuacao: 'DESC' },
            take: limit,
        });
    }
    // ── Escrita ───────────────────────────────────────────────────────────────
    async create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async update(id, data) {
        await this.repo.update(id, data);
        return this.findById(id);
    }
    async updatePassword(id, hashedPassword) {
        const result = await this.repo.update(id, { senha: hashedPassword });
        return (result.affected ?? 0) > 0;
    }
    async updateScore(id, delta) {
        await this.repo
            .createQueryBuilder()
            .update(Usuario_1.Usuario)
            .set({ pontuacao: () => `pontuacao + ${delta}` })
            .where('id = :id', { id })
            .execute();
        return this.findById(id);
    }
    async updateRole(id, role) {
        const result = await this.repo.update(id, { role });
        return (result.affected ?? 0) > 0;
    }
    async deactivate(id) {
        const result = await this.repo.update(id, { status: false });
        return (result.affected ?? 0) > 0;
    }
    async existsByEmail(email) {
        return (await this.repo.count({ where: { email } })) > 0;
    }
}
exports.UsuarioRepository = UsuarioRepository;
//# sourceMappingURL=UsuarioRepository.js.map
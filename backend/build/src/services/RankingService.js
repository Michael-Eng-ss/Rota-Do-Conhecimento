"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const UsuarioRepository_1 = require("../repositories/UsuarioRepository");
function toRankingEntry(u, index) {
    return {
        position: index + 1,
        id: u.id,
        nome: u.nome,
        foto: u.foto,
        pontuacao: u.pontuacao,
        campusId: u.campusId,
        cursoId: u.cursoId,
    };
}
class RankingService {
    constructor(dataSource) {
        this.usuarioRepo = new UsuarioRepository_1.UsuarioRepository(dataSource);
    }
    async getGlobalRanking(limit = 100) {
        const users = await this.usuarioRepo.findGlobalRanking(limit);
        return users.map(toRankingEntry);
    }
    async getRankingByCurso(cursoId, limit = 50) {
        const users = await this.usuarioRepo.findRankingByCurso(cursoId, limit);
        return users.map(toRankingEntry);
    }
    async getRankingByCampus(campusId, limit = 50) {
        const users = await this.usuarioRepo.findRankingByCampus(campusId, limit);
        return users.map(toRankingEntry);
    }
}
exports.RankingService = RankingService;
//# sourceMappingURL=RankingService.js.map
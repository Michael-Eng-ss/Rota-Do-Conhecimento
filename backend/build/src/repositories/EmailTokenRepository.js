"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTokenRepository = void 0;
const EmailToken_1 = require("../entities/EmailToken");
const uuid_1 = require("uuid");
class EmailTokenRepository {
    constructor(dataSource) {
        this.repo = dataSource.getRepository(EmailToken_1.EmailToken);
    }
    /** Cria um token com TTL em minutos. */
    async create(usuarioId, tipo, ttlMinutes) {
        const token = (0, uuid_1.v4)();
        const expiraEm = new Date(Date.now() + ttlMinutes * 60 * 1000);
        const entity = this.repo.create({ usuarioId, token, tipo, expiraEm });
        await this.repo.save(entity);
        return token;
    }
    /** Busca token válido (não expirado, não usado). */
    async findValid(token, tipo) {
        return this.repo
            .createQueryBuilder('t')
            .where('t.token = :token AND t.tipo = :tipo AND t.usado = false AND t.expiraEm > NOW()', {
            token,
            tipo,
        })
            .getOne();
    }
    async markUsed(token) {
        await this.repo.update({ token }, { usado: true });
    }
}
exports.EmailTokenRepository = EmailTokenRepository;
//# sourceMappingURL=EmailTokenRepository.js.map
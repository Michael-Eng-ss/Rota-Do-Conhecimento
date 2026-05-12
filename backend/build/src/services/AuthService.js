"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
const UsuarioRepository_1 = require("@/repositories/UsuarioRepository");
const LogRepository_1 = require("@/repositories/LogRepository");
const EmailTokenRepository_1 = require("@/repositories/EmailTokenRepository");
const AppError_1 = require("@/shared/AppError");
const constants_1 = require("@/shared/constants");
const EmailService_1 = require("@/services/EmailService");
const JWT_SECRET = process.env.JWT_SECRET || '3099708496ef917af0b641323143ba7a';
const BCRYPT_ROUNDS = 12;
class AuthService {
    constructor(dataSource) {
        this.usuarioRepo = new UsuarioRepository_1.UsuarioRepository(dataSource);
        this.logRepo = new LogRepository_1.LogRepository(dataSource);
        this.emailTokenRepo = new EmailTokenRepository_1.EmailTokenRepository(dataSource);
        this.emailService = new EmailService_1.EmailService();
    }
    // ── Login ─────────────────────────────────────────────────────────────────
    async login(email, senha) {
        const user = await this.usuarioRepo.findByEmailWithPassword(email);
        if (!user)
            throw AppError_1.AppError.unauthorized('Email e/ou Senha Incorretos');
        if (!user.status)
            throw AppError_1.AppError.forbidden('Conta desativada. Entre em contato com o suporte.');
        const valid = await this.verifyPassword(senha, user.senha);
        if (!valid)
            throw AppError_1.AppError.unauthorized('Email e/ou Senha Incorretos');
        // Re-hash progressivo: se a senha ainda estava em SHA-256, atualiza para bcrypt
        if (this.isSha256Hash(user.senha)) {
            const newHash = await bcrypt.hash(senha, BCRYPT_ROUNDS);
            await this.usuarioRepo.updatePassword(user.id, newHash);
        }
        const payload = {
            id: user.id,
            name: user.nome,
            role: user.role,
            campusId: user.campusId,
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: constants_1.JWT_EXPIRES_IN });
        await this.logRepo.create(user.id, 'Login successfully');
        const { senha: _removed, ...safeUser } = user;
        void _removed;
        return {
            token,
            role: user.role,
            campusId: user.campusId,
            user: safeUser,
        };
    }
    // ── Recuperação de Senha ──────────────────────────────────────────────────
    async forgotPassword(email) {
        const user = await this.usuarioRepo.findByEmailWithPassword(email);
        // Resposta genérica para não revelar existência do e-mail
        if (!user)
            return { message: 'Se o e-mail existir, você receberá as instruções.' };
        const token = await this.emailTokenRepo.create(user.id, constants_1.EmailTokenType.RESET_PASSWORD, constants_1.TOKEN_TTL_MINUTES.RESET_PASSWORD);
        await this.emailService.sendPasswordReset(email, user.nome, token);
        return { message: 'Se o e-mail existir, você receberá as instruções.' };
    }
    async resetPassword(token, novaSenha) {
        const record = await this.emailTokenRepo.findValid(token, constants_1.EmailTokenType.RESET_PASSWORD);
        if (!record)
            throw AppError_1.AppError.badRequest('Link inválido ou expirado');
        const hashed = await bcrypt.hash(novaSenha, BCRYPT_ROUNDS);
        await this.usuarioRepo.updatePassword(record.usuarioId, hashed);
        await this.emailTokenRepo.markUsed(token);
        return { message: 'Senha atualizada com sucesso!' };
    }
    // ── Helpers privados ──────────────────────────────────────────────────────
    /**
     * Verifica senha suportando tanto bcrypt (novo) quanto SHA-256 (legado).
     * Permite migração progressiva sem resetar senhas de todos os usuários.
     */
    async verifyPassword(plain, stored) {
        if (this.isSha256Hash(stored)) {
            // Fallback legado: SHA-256
            const sha = crypto.createHash('sha256').update(plain).digest('hex');
            return sha === stored;
        }
        // Verificação bcrypt padrão
        return bcrypt.compare(plain, stored);
    }
    /** Detecta se o hash é SHA-256 (64 chars hex, sem $2b$ prefix). */
    isSha256Hash(hash) {
        return /^[a-f0-9]{64}$/.test(hash);
    }
    /** Verifica e decodifica um JWT. */
    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch {
            return null;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map
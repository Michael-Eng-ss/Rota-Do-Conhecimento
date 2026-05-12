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
exports.AdminService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const UsuarioRepository_1 = require("../repositories/UsuarioRepository");
const CampusRepository_1 = require("../repositories/CampusRepository");
const AppError_1 = require("../shared/AppError");
const constants_1 = require("../shared/constants");
const BCRYPT_ROUNDS = 12;
class AdminService {
    constructor(dataSource) {
        this.usuarioRepo = new UsuarioRepository_1.UsuarioRepository(dataSource);
        this.campusRepo = new CampusRepository_1.CampusRepository(dataSource);
    }
    /**
     * Cria um novo admin.
     * Regras:
     * - Apenas SUPER_ADMIN pode criar outro SUPER_ADMIN ou ADMIN.
     * - SUPER_ADMIN e ADMIN podem criar CAMPUS_ADMIN.
     * - CAMPUS_ADMIN requer campusId.
     */
    async createAdmin(data, requester) {
        this.assertCanCreateRole(data.role, requester);
        if (await this.usuarioRepo.existsByEmail(data.email)) {
            throw AppError_1.AppError.conflict('E-mail já cadastrado');
        }
        if (data.role === constants_1.Role.CAMPUS_ADMIN) {
            if (!data.campusId)
                throw AppError_1.AppError.badRequest('campus_admin requer campusId');
            const campus = await this.campusRepo.findById(data.campusId);
            if (!campus)
                throw AppError_1.AppError.badRequest('Campus não encontrado');
        }
        const senha = await bcrypt.hash(data.senha, BCRYPT_ROUNDS);
        const user = await this.usuarioRepo.create({
            nome: data.nome,
            email: data.email,
            senha,
            role: data.role,
            campusId: data.campusId ?? null,
            cursoId: data.cursoId ?? null,
            pontuacao: 0,
            status: true,
        });
        const { senha: _, ...safe } = user;
        void _;
        return safe;
    }
    /** Promove um usuário existente para um novo role. */
    async promoteUser(targetId, newRole, requester) {
        this.assertCanCreateRole(newRole, requester);
        const target = await this.usuarioRepo.findById(targetId);
        if (!target)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        // Não permite rebaixar alguém com role >= ao do requester
        if (constants_1.ROLE_HIERARCHY[target.role] >= constants_1.ROLE_HIERARCHY[requester.role]) {
            throw AppError_1.AppError.forbidden('Não é possível alterar o role deste usuário');
        }
        await this.usuarioRepo.updateRole(targetId, newRole);
        return { message: `Usuário promovido para ${newRole} com sucesso` };
    }
    /** Lista todos os usuários (admin e players). */
    async listAll() {
        const users = await this.usuarioRepo.findAll();
        return users.map((u) => {
            const { senha: _, ...safe } = u;
            void _;
            return safe;
        });
    }
    /** Lista usuários de um campus (para campus_admin). */
    async listByCampus(campusId) {
        const users = await this.usuarioRepo.findByCampus(campusId);
        return users.map((u) => {
            const { senha: _, ...safe } = u;
            void _;
            return safe;
        });
    }
    // ── Helpers privados ──────────────────────────────────────────────────────
    assertCanCreateRole(targetRole, requester) {
        const myLevel = constants_1.ROLE_HIERARCHY[requester.role];
        const targetLevel = constants_1.ROLE_HIERARCHY[targetRole];
        // Só pode criar roles MENORES que o próprio
        if (targetLevel >= myLevel) {
            throw AppError_1.AppError.forbidden('Você não possui permissão para criar um usuário com este nível de acesso');
        }
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=AdminService.js.map
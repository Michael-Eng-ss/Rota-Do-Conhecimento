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
exports.UsuarioService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const UsuarioRepository_1 = require("../repositories/UsuarioRepository");
const CampusRepository_1 = require("../repositories/CampusRepository");
const AppError_1 = require("../shared/AppError");
const constants_1 = require("../shared/constants");
const BCRYPT_ROUNDS = 12;
class UsuarioService {
    constructor(dataSource) {
        this.usuarioRepo = new UsuarioRepository_1.UsuarioRepository(dataSource);
        this.campusRepo = new CampusRepository_1.CampusRepository(dataSource);
    }
    async getById(id) {
        const user = await this.usuarioRepo.findByIdWithRelations(id);
        if (!user)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        const { senha: _, ...safe } = user;
        void _;
        return safe;
    }
    async create(data) {
        if (await this.usuarioRepo.existsByEmail(data.email)) {
            throw AppError_1.AppError.conflict('E-mail já cadastrado');
        }
        if (data.campusId) {
            const campus = await this.campusRepo.findById(data.campusId);
            if (!campus)
                throw AppError_1.AppError.badRequest('Campus não encontrado');
        }
        const senha = await bcrypt.hash(data.senha, BCRYPT_ROUNDS);
        const user = await this.usuarioRepo.create({
            nome: data.nome,
            email: data.email,
            senha,
            role: constants_1.Role.PLAYER,
            pontuacao: 0,
            status: true,
            telefone: data.telefone,
            datanascimento: data.datanascimento ? new Date(data.datanascimento) : null,
            uf: data.uf,
            cidade: data.cidade,
            turma: data.turma,
            periodo: data.periodo,
            cursoId: data.cursoId,
            campusId: data.campusId,
        });
        const { senha: _, ...safe } = user;
        void _;
        return safe;
    }
    async update(id, data) {
        const user = await this.usuarioRepo.findById(id);
        if (!user)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        if (data.campusId && data.campusId !== user.campusId) {
            const campus = await this.campusRepo.findById(data.campusId);
            if (!campus)
                throw AppError_1.AppError.badRequest('Campus não encontrado');
        }
        const updated = await this.usuarioRepo.update(id, data);
        if (!updated)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        const { senha: _, ...safe } = updated;
        void _;
        return safe;
    }
    async updatePassword(id, novaSenha) {
        const exists = await this.usuarioRepo.findById(id);
        if (!exists)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        const hashed = await bcrypt.hash(novaSenha, BCRYPT_ROUNDS);
        await this.usuarioRepo.updatePassword(id, hashed);
        return { message: 'Senha atualizada com sucesso' };
    }
    async updateScore(id, delta) {
        const user = await this.usuarioRepo.findById(id);
        if (!user)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        const updated = await this.usuarioRepo.updateScore(id, delta);
        if (!updated)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        const { senha: _, ...safe } = updated;
        void _;
        return safe;
    }
    async deactivate(id) {
        const ok = await this.usuarioRepo.deactivate(id);
        if (!ok)
            throw AppError_1.AppError.notFound('Usuário não encontrado');
        return { message: 'Usuário desativado com sucesso' };
    }
    async findByCurso(cursoId, skip = 0, take = 20) {
        const users = await this.usuarioRepo.findByCurso(cursoId, skip, take);
        return users.map((u) => {
            const { senha: _, ...safe } = u;
            void _;
            return safe;
        });
    }
    /** Verifica se o requester tem permissão para editar o target. */
    static canEditUser(requesterId, requesterRole, targetId) {
        if (requesterId === targetId)
            return true; // próprio usuário
        return constants_1.ROLE_HIERARCHY[requesterRole] >= constants_1.ROLE_HIERARCHY[constants_1.Role.ADMIN];
    }
}
exports.UsuarioService = UsuarioService;
//# sourceMappingURL=UsuarioService.js.map
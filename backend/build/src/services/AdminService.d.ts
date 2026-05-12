import { DataSource } from 'typeorm';
import { Role } from '../shared/constants';
import { JWTPayload } from './AuthService';
import { Usuario } from '../entities/Usuario';
export interface CreateAdminDTO {
    nome: string;
    email: string;
    senha: string;
    role: Role.ADMIN | Role.CAMPUS_ADMIN | Role.SUPER_ADMIN;
    campusId?: number;
    cursoId?: number;
}
export declare class AdminService {
    private usuarioRepo;
    private campusRepo;
    constructor(dataSource: DataSource);
    /**
     * Cria um novo admin.
     * Regras:
     * - Apenas SUPER_ADMIN pode criar outro SUPER_ADMIN ou ADMIN.
     * - SUPER_ADMIN e ADMIN podem criar CAMPUS_ADMIN.
     * - CAMPUS_ADMIN requer campusId.
     */
    createAdmin(data: CreateAdminDTO, requester: JWTPayload): Promise<Omit<Usuario, 'senha'>>;
    /** Promove um usuário existente para um novo role. */
    promoteUser(targetId: number, newRole: Role, requester: JWTPayload): Promise<{
        message: string;
    }>;
    /** Lista todos os usuários (admin e players). */
    listAll(): Promise<Omit<Usuario, 'senha'>[]>;
    /** Lista usuários de um campus (para campus_admin). */
    listByCampus(campusId: number): Promise<Omit<Usuario, 'senha'>[]>;
    private assertCanCreateRole;
}
//# sourceMappingURL=AdminService.d.ts.map
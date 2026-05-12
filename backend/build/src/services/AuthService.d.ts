import { DataSource } from 'typeorm';
import { Role } from '../shared/constants';
import { Usuario } from '../entities/Usuario';
import { JWTPayload } from '../shared/types';
export type { JWTPayload };
export interface LoginResult {
    token: string;
    role: Role;
    campusId: number | null;
    user: Omit<Usuario, 'senha'>;
}
export declare class AuthService {
    private usuarioRepo;
    private logRepo;
    private emailTokenRepo;
    private emailService;
    constructor(dataSource: DataSource);
    login(email: string, senha: string): Promise<LoginResult>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, novaSenha: string): Promise<{
        message: string;
    }>;
    /**
     * Verifica senha suportando tanto bcrypt (novo) quanto SHA-256 (legado).
     * Permite migração progressiva sem resetar senhas de todos os usuários.
     */
    private verifyPassword;
    /** Detecta se o hash é SHA-256 (64 chars hex, sem $2b$ prefix). */
    private isSha256Hash;
    /** Verifica e decodifica um JWT. */
    static verifyToken(token: string): JWTPayload | null;
}
//# sourceMappingURL=AuthService.d.ts.map
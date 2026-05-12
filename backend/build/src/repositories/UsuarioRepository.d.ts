import { DataSource, DeepPartial } from 'typeorm';
import { Usuario } from '../entities/Usuario';
import { Role } from '../shared/constants';
export declare class UsuarioRepository {
    private repo;
    constructor(dataSource: DataSource);
    /** Busca por e-mail, incluindo a senha (select: false). */
    findByEmailWithPassword(email: string): Promise<Usuario | null>;
    findById(id: number): Promise<Usuario | null>;
    findByIdWithRelations(id: number): Promise<Usuario | null>;
    findByCampus(campusId: number): Promise<Usuario[]>;
    findByCurso(cursoId: number, skip?: number, take?: number): Promise<Usuario[]>;
    findAll(): Promise<Usuario[]>;
    findRankingByCurso(cursoId: number, limit?: number): Promise<Usuario[]>;
    findRankingByCampus(campusId: number, limit?: number): Promise<Usuario[]>;
    findGlobalRanking(limit?: number): Promise<Usuario[]>;
    create(data: Partial<Usuario>): Promise<Usuario>;
    update(id: number, data: DeepPartial<Usuario>): Promise<Usuario | null>;
    updatePassword(id: number, hashedPassword: string): Promise<boolean>;
    updateScore(id: number, delta: number): Promise<Usuario | null>;
    updateRole(id: number, role: Role): Promise<boolean>;
    deactivate(id: number): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
}
//# sourceMappingURL=UsuarioRepository.d.ts.map
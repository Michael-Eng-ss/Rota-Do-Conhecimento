import { DataSource } from 'typeorm';
import { Role } from '../shared/constants';
import { Usuario } from '../entities/Usuario';
export interface CreateUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    datanascimento?: string;
    uf?: string;
    cidade?: string;
    turma?: string;
    periodo?: number;
    cursoId?: number;
    campusId?: number;
}
export interface UpdateUsuarioDTO {
    nome?: string;
    email?: string;
    telefone?: string;
    datanascimento?: string;
    uf?: string;
    cidade?: string;
    turma?: string;
    periodo?: number;
    foto?: string;
    cursoId?: number;
    campusId?: number;
}
export declare class UsuarioService {
    private usuarioRepo;
    private campusRepo;
    constructor(dataSource: DataSource);
    getById(id: number): Promise<Omit<Usuario, 'senha'>>;
    create(data: CreateUsuarioDTO): Promise<Omit<Usuario, 'senha'>>;
    update(id: number, data: UpdateUsuarioDTO): Promise<Omit<Usuario, 'senha'>>;
    updatePassword(id: number, novaSenha: string): Promise<{
        message: string;
    }>;
    updateScore(id: number, delta: number): Promise<Omit<Usuario, 'senha'>>;
    deactivate(id: number): Promise<{
        message: string;
    }>;
    findByCurso(cursoId: number, skip?: number, take?: number): Promise<Omit<Usuario, 'senha'>[]>;
    /** Verifica se o requester tem permissão para editar o target. */
    static canEditUser(requesterId: number, requesterRole: Role, targetId: number): boolean;
}
//# sourceMappingURL=UsuarioService.d.ts.map
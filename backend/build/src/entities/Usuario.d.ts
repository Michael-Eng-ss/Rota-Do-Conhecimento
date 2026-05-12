import { Role } from '@/shared/constants';
import { Campus } from '@/entities/Campus';
import { Curso } from '@/entities/Curso';
export declare class Usuario {
    [key: string]: unknown;
    id: number;
    nome: string;
    email: string;
    /**
     * Senha armazenada como bcrypt hash.
     * select: false → nunca retornado em queries padrão.
     */
    senha: string;
    /**
     * Nível de acesso do usuário.
     * Mapeado como VARCHAR no banco (migration necessária para DBs existentes).
     */
    role: Role;
    /** Pontuação acumulada no jogo. */
    pontuacao: number;
    /** URL da foto de perfil. */
    foto: string | null;
    /** Telefone de contato. */
    telefone: string | null;
    /** Campo legado de sexo (0=não definido, 1=masc, 2=fem). Mantido por retrocompatibilidade. */
    sexo: number | null;
    datanascimento: Date | null;
    uf: string | null;
    cidade: string | null;
    turma: string | null;
    periodo: number | null;
    status: boolean;
    campusId: number | null;
    campus: Campus | null;
    cursoId: number | null;
    curso: Curso | null;
    createdAt: Date;
    get isAdmin(): boolean;
    get isCampusAdmin(): boolean;
    /** Retorna objeto seguro sem senha. */
    toSafeJSON(): {
        [x: string]: unknown;
    };
}
//# sourceMappingURL=Usuario.d.ts.map
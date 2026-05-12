import { DataSource } from 'typeorm';
import { Progresso } from '../entities/Progresso';
export declare class ProgressoRepository {
    private repo;
    constructor(dataSource: DataSource);
    findByUsuario(usuariosid: number): Promise<Progresso[]>;
    findByQuizAndUsuario(perguntasids: number[], usuariosid: number): Promise<Progresso[]>;
    findById(id: number): Promise<Progresso | null>;
    create(data: Partial<Progresso>): Promise<Progresso>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=ProgressoRepository.d.ts.map
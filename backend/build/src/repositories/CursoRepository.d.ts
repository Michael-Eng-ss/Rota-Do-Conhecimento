import { DataSource } from 'typeorm';
import { Curso } from '../entities/Curso';
export declare class CursoRepository {
    private repo;
    constructor(dataSource: DataSource);
    findAll(): Promise<Curso[]>;
    findById(id: number): Promise<Curso | null>;
    create(data: Partial<Curso>): Promise<Curso>;
    update(id: number, data: Partial<Curso>): Promise<Curso | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=CursoRepository.d.ts.map
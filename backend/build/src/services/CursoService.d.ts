import { DataSource } from 'typeorm';
import { Curso } from '../entities/Curso';
export declare class CursoService {
    private repo;
    constructor(dataSource: DataSource);
    getAll(): Promise<Curso[]>;
    getById(id: number): Promise<Curso>;
    create(data: Partial<Curso>): Promise<Curso>;
    update(id: number, data: Partial<Curso>): Promise<Curso>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=CursoService.d.ts.map
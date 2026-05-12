import { DataSource } from 'typeorm';
import { Categoria } from '../entities/Categoria';
export declare class CategoriaService {
    private repo;
    constructor(dataSource: DataSource);
    getAll(): Promise<Categoria[]>;
    getByCurso(cursoid: number): Promise<Categoria[]>;
    getById(id: number): Promise<Categoria>;
    create(data: Partial<Categoria>): Promise<Categoria>;
    update(id: number, data: Partial<Categoria>): Promise<Categoria>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=CategoriaService.d.ts.map
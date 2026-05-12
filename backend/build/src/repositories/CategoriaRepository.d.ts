import { DataSource } from 'typeorm';
import { Categoria } from '../entities/Categoria';
export declare class CategoriaRepository {
    private repo;
    constructor(dataSource: DataSource);
    findAll(): Promise<Categoria[]>;
    findByCurso(cursoid: number): Promise<Categoria[]>;
    findById(id: number): Promise<Categoria | null>;
    create(data: Partial<Categoria>): Promise<Categoria>;
    update(id: number, data: Partial<Categoria>): Promise<Categoria | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=CategoriaRepository.d.ts.map
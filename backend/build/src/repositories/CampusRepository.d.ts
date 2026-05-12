import { DataSource } from 'typeorm';
import { Campus } from '../entities/Campus';
export declare class CampusRepository {
    private repo;
    constructor(dataSource: DataSource);
    findAll(): Promise<Campus[]>;
    findById(id: number): Promise<Campus | null>;
    create(nome: string): Promise<Campus>;
    update(id: number, nome: string): Promise<Campus | null>;
    delete(id: number): Promise<boolean>;
    existsByName(nome: string): Promise<boolean>;
}
//# sourceMappingURL=CampusRepository.d.ts.map
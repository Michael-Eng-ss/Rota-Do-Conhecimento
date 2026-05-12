import { DataSource } from 'typeorm';
import { Campus } from '../entities/Campus';
export declare class CampusService {
    private campusRepo;
    constructor(dataSource: DataSource);
    getAll(): Promise<Campus[]>;
    getById(id: number): Promise<Campus>;
    create(nome: string): Promise<Campus>;
    update(id: number, nome: string): Promise<Campus>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=CampusService.d.ts.map
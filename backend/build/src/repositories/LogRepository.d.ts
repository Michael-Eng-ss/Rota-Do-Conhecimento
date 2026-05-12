import { DataSource } from 'typeorm';
import { Log } from '../entities/Log';
export declare class LogRepository {
    private repo;
    constructor(dataSource: DataSource);
    create(usuariosId: number, acao: string): Promise<Log>;
    findByDateRange(start: Date, end: Date): Promise<Log[]>;
    findByUser(usuariosId: number, limit?: number): Promise<Log[]>;
}
//# sourceMappingURL=LogRepository.d.ts.map
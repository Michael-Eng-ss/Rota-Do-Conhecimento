import { DataSource } from 'typeorm';
import { Alternativa } from '../entities/Alternativa';
export declare class AlternativaService {
    private repo;
    constructor(dataSource: DataSource);
    getByPergunta(perguntasid: number): Promise<Alternativa[]>;
    getById(id: number): Promise<Alternativa>;
    create(data: Partial<Alternativa>): Promise<Alternativa>;
    update(id: number, data: Partial<Alternativa>): Promise<Alternativa>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=AlternativaService.d.ts.map
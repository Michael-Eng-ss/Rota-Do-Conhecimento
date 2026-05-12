import { DataSource } from 'typeorm';
import { Alternativa } from '../entities/Alternativa';
export declare class AlternativaRepository {
    private repo;
    constructor(dataSource: DataSource);
    findByPergunta(perguntasid: number): Promise<Alternativa[]>;
    findById(id: number): Promise<Alternativa | null>;
    create(data: Partial<Alternativa>): Promise<Alternativa>;
    update(id: number, data: Partial<Alternativa>): Promise<Alternativa | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=AlternativaRepository.d.ts.map
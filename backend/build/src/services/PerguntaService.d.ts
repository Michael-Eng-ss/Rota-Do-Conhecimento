import { DataSource } from 'typeorm';
import { Pergunta } from '../entities/Pergunta';
export declare class PerguntaService {
    private repo;
    constructor(dataSource: DataSource);
    getAll(): Promise<Pergunta[]>;
    getById(id: number): Promise<Pergunta>;
    getCompletas(categoriasid: number, activeOnly: boolean): Promise<Pergunta[]>;
    create(data: Partial<Pergunta>): Promise<Pergunta>;
    update(id: number, data: Partial<Pergunta>): Promise<Pergunta>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=PerguntaService.d.ts.map
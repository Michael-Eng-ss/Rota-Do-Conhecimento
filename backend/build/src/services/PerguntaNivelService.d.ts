import { DataSource } from 'typeorm';
import { PerguntaNivel } from '../entities/PerguntaNivel';
export declare class PerguntaNivelService {
    private repo;
    constructor(dataSource: DataSource);
    getAll(): Promise<PerguntaNivel[]>;
    getById(id: number): Promise<PerguntaNivel>;
    create(data: Partial<PerguntaNivel>): Promise<PerguntaNivel>;
    update(id: number, data: Partial<PerguntaNivel>): Promise<PerguntaNivel>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=PerguntaNivelService.d.ts.map
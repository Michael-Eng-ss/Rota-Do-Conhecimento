import { DataSource } from 'typeorm';
import { PerguntaNivel } from '../entities/PerguntaNivel';
export declare class PerguntaNivelRepository {
    private repo;
    constructor(dataSource: DataSource);
    findAll(): Promise<PerguntaNivel[]>;
    findById(id: number): Promise<PerguntaNivel | null>;
    create(data: Partial<PerguntaNivel>): Promise<PerguntaNivel>;
    update(id: number, data: Partial<PerguntaNivel>): Promise<PerguntaNivel | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=PerguntaNivelRepository.d.ts.map
import { DataSource } from 'typeorm';
import { Pergunta } from '../entities/Pergunta';
export declare class PerguntaRepository {
    private repo;
    constructor(dataSource: DataSource);
    findAll(): Promise<Pergunta[]>;
    findById(id: number): Promise<Pergunta | null>;
    /** Retorna perguntas de uma categoria com alternativas (join completo). */
    findCompletasByCategoria(categoriasid: number, activeOnly: boolean): Promise<Pergunta[]>;
    create(data: Partial<Pergunta>): Promise<Pergunta>;
    update(id: number, data: Partial<Pergunta>): Promise<Pergunta | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=PerguntaRepository.d.ts.map
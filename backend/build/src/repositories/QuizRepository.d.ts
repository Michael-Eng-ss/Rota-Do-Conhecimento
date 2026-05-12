import { DataSource } from 'typeorm';
import { Quiz } from '../entities/Quiz';
export declare class QuizRepository {
    private repo;
    constructor(dataSource: DataSource);
    findAll(): Promise<Quiz[]>;
    findById(id: number): Promise<Quiz | null>;
    findByCurso(cursoid: number): Promise<Quiz[]>;
    create(data: Partial<Quiz>): Promise<Quiz>;
    update(id: number, data: Partial<Quiz>): Promise<Quiz | null>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=QuizRepository.d.ts.map
import { DataSource } from 'typeorm';
import { Quiz } from '../entities/Quiz';
export declare class QuizService {
    private repo;
    constructor(dataSource: DataSource);
    getAll(): Promise<Quiz[]>;
    getByCurso(cursoid: number): Promise<Quiz[]>;
    getById(id: number): Promise<Quiz>;
    create(data: Partial<Quiz>): Promise<Quiz>;
    update(id: number, data: Partial<Quiz>): Promise<Quiz>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=QuizService.d.ts.map
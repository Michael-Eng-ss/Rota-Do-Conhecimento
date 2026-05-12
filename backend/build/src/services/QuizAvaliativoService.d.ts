import { DataSource } from 'typeorm';
import { QuizAvalativoUsuario } from '../entities/QuizAvalativoUsuario';
export declare class QuizAvaliativoService {
    private repo;
    constructor(dataSource: DataSource);
    getByUsuario(usuarioid: number): Promise<QuizAvalativoUsuario[]>;
    getByQuiz(quizid: number): Promise<QuizAvalativoUsuario[]>;
    getById(id: number): Promise<QuizAvalativoUsuario>;
    create(data: Partial<QuizAvalativoUsuario>): Promise<QuizAvalativoUsuario>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=QuizAvaliativoService.d.ts.map
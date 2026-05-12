import { DataSource } from 'typeorm';
import { QuizAvalativoUsuario } from '../entities/QuizAvalativoUsuario';
export declare class QuizAvaliativoRepository {
    private repo;
    constructor(dataSource: DataSource);
    findByUsuario(usuarioid: number): Promise<QuizAvalativoUsuario[]>;
    findByQuiz(quizid: number): Promise<QuizAvalativoUsuario[]>;
    findById(id: number): Promise<QuizAvalativoUsuario | null>;
    create(data: Partial<QuizAvalativoUsuario>): Promise<QuizAvalativoUsuario>;
    delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=QuizAvaliativoRepository.d.ts.map
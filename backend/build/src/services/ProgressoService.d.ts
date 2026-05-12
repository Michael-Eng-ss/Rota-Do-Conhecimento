import { DataSource } from 'typeorm';
import { Progresso } from '../entities/Progresso';
export declare class ProgressoService {
    private repo;
    private perguntaRepo;
    constructor(dataSource: DataSource);
    getByUsuario(usuariosid: number): Promise<Progresso[]>;
    /**
     * Retorna o progresso do usuário para as perguntas de um quiz (quizid).
     * Primeiro busca os ids das perguntas do quiz, depois filtra o progresso.
     */
    getByQuizAndUsuario(quizid: number, usuariosid: number): Promise<Progresso[]>;
    /**
     * Retorna o progresso do usuário para as perguntas de uma categoria dentro de um quiz.
     */
    getByCategQuizAndUsuario(categoriasid: number, quizid: number, usuariosid: number): Promise<Progresso[]>;
    create(data: Partial<Progresso>): Promise<Progresso>;
}
//# sourceMappingURL=ProgressoService.d.ts.map
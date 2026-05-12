import { Request, Response } from 'express';
export declare class QuizAvaliativoController {
    private service;
    constructor();
    /** GET /quiz-avaliativo/usuario/:userId */
    getByUsuario: (req: Request, res: Response) => Promise<void>;
    /** GET /quiz-avaliativo/quiz/:quizId */
    getByQuiz: (req: Request, res: Response) => Promise<void>;
    /** POST /quiz-avaliativo */
    create: (req: Request, res: Response) => Promise<void>;
    /** DELETE /quiz-avaliativo/:id */
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare const quizAvaliativoController: QuizAvaliativoController;
//# sourceMappingURL=QuizAvaliativoController.d.ts.map
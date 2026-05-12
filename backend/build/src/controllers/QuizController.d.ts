import { Request, Response } from 'express';
export declare class QuizController {
    private service;
    constructor();
    getAll: (_req: Request, res: Response) => Promise<void>;
    getByCurso: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare const quizController: QuizController;
//# sourceMappingURL=QuizController.d.ts.map
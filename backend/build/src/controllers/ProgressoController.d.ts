import { Request, Response } from 'express';
export declare class ProgressoController {
    private service;
    constructor();
    /** GET /progresso-perguntas/quiz/:quizId/usuario/:userId */
    getByQuizAndUsuario: (req: Request, res: Response) => Promise<void>;
    /** GET /progresso-perguntas/categoria/:catId/quiz/:quizId/usuario/:userId */
    getByCategQuizAndUsuario: (req: Request, res: Response) => Promise<void>;
    /** POST /progresso-perguntas */
    create: (req: Request, res: Response) => Promise<void>;
}
export declare const progressoController: ProgressoController;
//# sourceMappingURL=ProgressoController.d.ts.map
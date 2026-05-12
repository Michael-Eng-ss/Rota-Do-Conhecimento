import { Request, Response } from 'express';
export declare class PerguntaController {
    private service;
    constructor();
    /** GET /perguntas/todas */
    getAll: (_req: Request, res: Response) => Promise<void>;
    /** GET /perguntas/completas/:categoriaId?active=false */
    getCompletas: (req: Request, res: Response) => Promise<void>;
    /** GET /perguntas/:id */
    getById: (req: Request, res: Response) => Promise<void>;
    /** POST /perguntas */
    create: (req: Request, res: Response) => Promise<void>;
    /** PUT /perguntas/:id */
    update: (req: Request, res: Response) => Promise<void>;
    /** DELETE /perguntas/:id */
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare const perguntaController: PerguntaController;
//# sourceMappingURL=PerguntaController.d.ts.map
import { Request, Response } from 'express';
export declare class CursoController {
    private service;
    constructor();
    getAll: (_req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare const cursoController: CursoController;
//# sourceMappingURL=CursoController.d.ts.map
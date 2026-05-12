import { Request, Response } from 'express';
export declare class CategoriaController {
    private service;
    constructor();
    /** GET /categorias */
    getAll: (_req: Request, res: Response) => Promise<void>;
    /** GET /categorias/curso/:cursoId */
    getByCurso: (req: Request, res: Response) => Promise<void>;
    /** GET /categorias/:id */
    getById: (req: Request, res: Response) => Promise<void>;
    /** POST /categorias */
    create: (req: Request, res: Response) => Promise<void>;
    /** PUT /categorias/:id */
    update: (req: Request, res: Response) => Promise<void>;
    /** DELETE /categorias/:id */
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare const categoriaController: CategoriaController;
//# sourceMappingURL=CategoriaController.d.ts.map
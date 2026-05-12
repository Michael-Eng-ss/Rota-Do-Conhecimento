import { Request, Response } from 'express';
export declare class AlternativaController {
    private service;
    constructor();
    /** GET /alternativas/pergunta/:perguntaId */
    getByPergunta: (req: Request, res: Response) => Promise<void>;
    /** POST /alternativas */
    create: (req: Request, res: Response) => Promise<void>;
    /** PUT /alternativas/:id */
    update: (req: Request, res: Response) => Promise<void>;
    /** DELETE /alternativas/:id */
    delete: (req: Request, res: Response) => Promise<void>;
}
export declare const alternativaController: AlternativaController;
//# sourceMappingURL=AlternativaController.d.ts.map
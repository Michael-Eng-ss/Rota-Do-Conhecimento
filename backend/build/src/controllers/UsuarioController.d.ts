import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare class UsuarioController {
    private service;
    constructor();
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: AuthRequest, res: Response) => Promise<void>;
    updatePassword: (req: AuthRequest, res: Response) => Promise<void>;
    updateScore: (req: AuthRequest, res: Response) => Promise<void>;
    findByCurso: (req: Request, res: Response) => Promise<void>;
}
export declare const usuarioController: UsuarioController;
//# sourceMappingURL=UsuarioController.d.ts.map
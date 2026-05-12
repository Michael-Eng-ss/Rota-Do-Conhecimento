import { Request, Response } from 'express';
import { AuthRequest } from '@/middlewares/auth.middleware';
export declare class AdminController {
    private service;
    constructor();
    /** POST /admin/admins — cria novo admin (SUPER_ADMIN only). */
    createAdmin: (req: AuthRequest, res: Response) => Promise<void>;
    /** PUT /admin/usuarios/:id/role — promove usuário (SUPER_ADMIN only). */
    promoteUser: (req: AuthRequest, res: Response) => Promise<void>;
    /** GET /admin/usuarios — lista todos os usuários. */
    listAll: (_req: Request, res: Response) => Promise<void>;
    /** GET /admin/campus/:id/usuarios — lista usuários do campus. */
    listByCampus: (req: AuthRequest, res: Response) => Promise<void>;
}
export declare const adminController: AdminController;
//# sourceMappingURL=AdminController.d.ts.map
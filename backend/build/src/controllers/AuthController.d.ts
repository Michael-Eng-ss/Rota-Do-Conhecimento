import { Request, Response } from 'express';
export declare class AuthController {
    private service;
    constructor();
    login: (req: Request, res: Response) => Promise<void>;
    forgotPassword: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=AuthController.d.ts.map
import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../shared/types';
export type { JWTPayload };
/** Extensão do Request do Express com o payload do JWT. */
export interface AuthRequest extends Request {
    user?: JWTPayload;
}
/**
 * Middleware de autenticação.
 * Extrai e valida o JWT do header Authorization: Bearer <token>.
 * Popula req.user com o payload decodificado.
 */
export declare function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map
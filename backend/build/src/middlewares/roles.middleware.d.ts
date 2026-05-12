import { Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from './auth.middleware';
import { Role } from '../shared/constants';
/**
 * Middleware de autorização por role.
 * Verifica se o usuário autenticado possui pelo menos um dos roles exigidos.
 *
 * @param allowedRoles - Lista de roles permitidos para acessar a rota.
 */
export declare function requireRole(...allowedRoles: Role[]): RequestHandler;
/** Apenas SUPER_ADMIN. */
export declare const requireSuperAdmin: RequestHandler;
/** SUPER_ADMIN ou ADMIN. */
export declare const requireAdmin: RequestHandler;
/** SUPER_ADMIN, ADMIN ou CAMPUS_ADMIN. */
export declare const requireCampusAdmin: RequestHandler;
/**
 * Valida se um CAMPUS_ADMIN está acessando apenas seu próprio campus.
 * SUPER_ADMIN e ADMIN passam sem restrição.
 * Espera `req.params.campusId` ou `req.params.id` como ID do campus alvo.
 */
export declare function requireCampusOwner(req: AuthRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=roles.middleware.d.ts.map
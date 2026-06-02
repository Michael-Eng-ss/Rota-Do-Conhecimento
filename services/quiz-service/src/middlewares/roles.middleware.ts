import { Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../shared/AppError';
import { Role, ROLE_HIERARCHY } from '../shared/constants';

/**
 * Middleware de autorização por role.
 * Verifica se o usuário autenticado possui pelo menos um dos roles exigidos.
 *
 * @param allowedRoles - Lista de roles permitidos para acessar a rota.
 */
export function requireRole(...allowedRoles: Role[]): RequestHandler {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) throw AppError.unauthorized('Usuário não autenticado');

    const hasPermission = allowedRoles.some(
      (r) => ROLE_HIERARCHY[req.user!.role] >= ROLE_HIERARCHY[r],
    );

    if (!hasPermission) {
      throw AppError.forbidden(
        `Acesso negado. Requer um dos seguintes papéis: ${allowedRoles.join(', ')}`,
      );
    }
    next();
  };
}

// ── Atalhos semânticos ────────────────────────────────────────────────────

/** Apenas SUPER_ADMIN. */
export const requireSuperAdmin: RequestHandler = requireRole(Role.SUPER_ADMIN);

/** SUPER_ADMIN ou ADMIN. */
export const requireAdmin: RequestHandler = requireRole(Role.ADMIN);

/** SUPER_ADMIN, ADMIN ou CAMPUS_ADMIN. */
export const requireCampusAdmin: RequestHandler = requireRole(Role.CAMPUS_ADMIN);

/**
 * Valida se um CAMPUS_ADMIN está acessando apenas seu próprio campus.
 * SUPER_ADMIN e ADMIN passam sem restrição.
 * Espera `req.params.campusId` ou `req.params.id` como ID do campus alvo.
 */
export function requireCampusOwner(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (!req.user) throw AppError.unauthorized('Usuário não autenticado');

  // Super admin e admin têm acesso irrestrito
  if (ROLE_HIERARCHY[req.user.role] >= ROLE_HIERARCHY[Role.ADMIN]) {
    return next();
  }

  const targetCampusId = parseInt(String(req.params.campusId || req.params.id));
  if (req.user.campusId !== targetCampusId) {
    throw AppError.forbidden('Acesso restrito ao seu campus');
  }
  next();
}

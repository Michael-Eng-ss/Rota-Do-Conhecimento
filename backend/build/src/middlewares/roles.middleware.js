"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCampusAdmin = exports.requireAdmin = exports.requireSuperAdmin = void 0;
exports.requireRole = requireRole;
exports.requireCampusOwner = requireCampusOwner;
const AppError_1 = require("../shared/AppError");
const constants_1 = require("../shared/constants");
/**
 * Middleware de autorização por role.
 * Verifica se o usuário autenticado possui pelo menos um dos roles exigidos.
 *
 * @param allowedRoles - Lista de roles permitidos para acessar a rota.
 */
function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user)
            throw AppError_1.AppError.unauthorized('Usuário não autenticado');
        const hasPermission = allowedRoles.some((r) => constants_1.ROLE_HIERARCHY[req.user.role] >= constants_1.ROLE_HIERARCHY[r]);
        if (!hasPermission) {
            throw AppError_1.AppError.forbidden(`Acesso negado. Requer um dos seguintes papéis: ${allowedRoles.join(', ')}`);
        }
        next();
    };
}
// ── Atalhos semânticos ────────────────────────────────────────────────────
/** Apenas SUPER_ADMIN. */
exports.requireSuperAdmin = requireRole(constants_1.Role.SUPER_ADMIN);
/** SUPER_ADMIN ou ADMIN. */
exports.requireAdmin = requireRole(constants_1.Role.ADMIN);
/** SUPER_ADMIN, ADMIN ou CAMPUS_ADMIN. */
exports.requireCampusAdmin = requireRole(constants_1.Role.CAMPUS_ADMIN);
/**
 * Valida se um CAMPUS_ADMIN está acessando apenas seu próprio campus.
 * SUPER_ADMIN e ADMIN passam sem restrição.
 * Espera `req.params.campusId` ou `req.params.id` como ID do campus alvo.
 */
function requireCampusOwner(req, _res, next) {
    if (!req.user)
        throw AppError_1.AppError.unauthorized('Usuário não autenticado');
    // Super admin e admin têm acesso irrestrito
    if (constants_1.ROLE_HIERARCHY[req.user.role] >= constants_1.ROLE_HIERARCHY[constants_1.Role.ADMIN]) {
        return next();
    }
    const targetCampusId = parseInt(String(req.params.campusId || req.params.id));
    if (req.user.campusId !== targetCampusId) {
        throw AppError_1.AppError.forbidden('Acesso restrito ao seu campus');
    }
    next();
}
//# sourceMappingURL=roles.middleware.js.map
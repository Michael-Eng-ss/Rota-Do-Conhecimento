"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.requestLogger = requestLogger;
const AppError_1 = require("../shared/AppError");
/**
 * Middleware de validação de body.
 * Verifica que os campos obrigatórios existem e possuem o tipo correto.
 *
 * @example
 * router.post('/', validateBody({ email: 'string', senha: 'string' }), handler)
 */
function validateBody(schema) {
    return (req, _res, next) => {
        const missing = [];
        const invalid = [];
        for (const [field, type] of Object.entries(schema)) {
            const val = req.body?.[field];
            if (val === undefined || val === null) {
                missing.push(field);
            }
            else if (typeof val !== type) {
                invalid.push(`${field} deve ser ${type}`);
            }
        }
        if (missing.length > 0) {
            throw AppError_1.AppError.badRequest(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
        }
        if (invalid.length > 0) {
            throw AppError_1.AppError.badRequest(`Tipos inválidos: ${invalid.join('; ')}`);
        }
        next();
    };
}
/**
 * Logger de requisições.
 */
function requestLogger(req, _res, next) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${req.method} ${req.originalUrl}`);
    next();
}
//# sourceMappingURL=validation.middleware.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const AppError_1 = require("../shared/AppError");
/**
 * Handler para rotas não encontradas (404).
 * Registrar APÓS todas as rotas.
 */
function notFoundHandler(req, _res, next) {
    next(AppError_1.AppError.notFound(`Rota não encontrada: ${req.method} ${req.originalUrl}`));
}
/**
 * Middleware global de tratamento de erros.
 * Diferencia erros operacionais (AppError) de bugs inesperados.
 * Deve ser o ÚLTIMO middleware registrado.
 */
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    const appErr = err instanceof AppError_1.AppError ? err : null;
    const statusCode = appErr?.statusCode ?? 500;
    const isOp = appErr?.isOperational ?? false;
    if (!isOp) {
        console.error(`[CRITICAL] ${req.method} ${req.originalUrl}:`, {
            message: err.message,
            stack: err.stack,
            body: req.body,
        });
    }
    else {
        console.warn(`[WARN] ${req.method} ${req.originalUrl}: ${err.message}`);
    }
    const body = {
        status: 'error',
        statusCode,
        message: isOp ? err.message : 'Erro interno do servidor',
    };
    if (process.env.NODE_ENV === 'development' && !isOp) {
        body['stack'] = err.stack;
    }
    res.status(statusCode).json(body);
}
//# sourceMappingURL=error.middleware.js.map
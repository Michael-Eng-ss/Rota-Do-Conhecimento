"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * Erro operacional tipado — diferencia erros de negócio de bugs inesperados.
 * Erros com isOperational=true são exibidos diretamente ao cliente.
 */
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Mantém stack trace correto no V8
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
    static badRequest(message) { return new AppError(message, 400); }
    static unauthorized(message) { return new AppError(message, 401); }
    static forbidden(message) { return new AppError(message, 403); }
    static notFound(message) { return new AppError(message, 404); }
    static conflict(message) { return new AppError(message, 409); }
    static internal(message) { return new AppError(message, 500, false); }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map
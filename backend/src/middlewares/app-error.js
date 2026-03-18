/**
 * Classe de erro customizada com statusCode para uso nos handlers.
 * Uso: throw new AppError('Recurso não encontrado', 404);
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // diferencia erros esperados de bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };

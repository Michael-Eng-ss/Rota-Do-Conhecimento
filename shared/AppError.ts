/**
 * Erro operacional tipado — diferencia erros de negócio de bugs inesperados.
 * Erros com isOperational=true são exibidos diretamente ao cliente.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode  = statusCode;
    this.isOperational = isOperational;

    // Mantém stack trace correto no V8
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string)  { return new AppError(message, 400); }
  static unauthorized(message: string){ return new AppError(message, 401); }
  static forbidden(message: string)   { return new AppError(message, 403); }
  static notFound(message: string)    { return new AppError(message, 404); }
  static conflict(message: string)    { return new AppError(message, 409); }
  static internal(message: string)    { return new AppError(message, 500, false); }
}

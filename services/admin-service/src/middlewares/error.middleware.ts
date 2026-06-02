import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/AppError';

/**
 * Handler para rotas não encontradas (404).
 * Registrar APÓS todas as rotas.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Rota não encontrada: ${req.method} ${req.originalUrl}`));
}

/**
 * Middleware global de tratamento de erros.
 * Diferencia erros operacionais (AppError) de bugs inesperados.
 * Deve ser o ÚLTIMO middleware registrado.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const appErr    = err instanceof AppError ? err : null;
  const statusCode = appErr?.statusCode ?? 500;
  const isOp       = appErr?.isOperational ?? false;

  if (!isOp) {
    console.error(`[CRITICAL] ${req.method} ${req.originalUrl}:`, {
      message: err.message,
      stack:   err.stack,
      body:    req.body,
    });
  } else {
    console.warn(`[WARN] ${req.method} ${req.originalUrl}: ${err.message}`);
  }

  const body: Record<string, unknown> = {
    status:     'error',
    statusCode,
    message:    isOp ? err.message : 'Erro interno do servidor',
  };

  if (process.env.NODE_ENV === 'development' && !isOp) {
    body['stack'] = err.stack;
  }

  res.status(statusCode).json(body);
}

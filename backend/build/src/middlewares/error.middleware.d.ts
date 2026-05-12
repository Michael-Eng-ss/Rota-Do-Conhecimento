import { Request, Response, NextFunction } from 'express';
/**
 * Handler para rotas não encontradas (404).
 * Registrar APÓS todas as rotas.
 */
export declare function notFoundHandler(req: Request, _res: Response, next: NextFunction): void;
/**
 * Middleware global de tratamento de erros.
 * Diferencia erros operacionais (AppError) de bugs inesperados.
 * Deve ser o ÚLTIMO middleware registrado.
 */
export declare function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error.middleware.d.ts.map
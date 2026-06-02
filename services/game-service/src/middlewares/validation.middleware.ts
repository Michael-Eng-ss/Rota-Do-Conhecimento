import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../shared/AppError';

type FieldType = 'string' | 'number' | 'boolean';
type Schema = Record<string, FieldType>;

/**
 * Middleware de validação de body.
 * Verifica que os campos obrigatórios existem e possuem o tipo correto.
 *
 * @example
 * router.post('/', validateBody({ email: 'string', senha: 'string' }), handler)
 */
export function validateBody(schema: Schema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const missing: string[] = [];
    const invalid: string[] = [];

    for (const [field, type] of Object.entries(schema)) {
      const val = req.body?.[field];
      if (val === undefined || val === null) {
        missing.push(field);
      } else if (typeof val !== type) {
        invalid.push(`${field} deve ser ${type}`);
      }
    }

    if (missing.length > 0) {
      throw AppError.badRequest(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
    }
    if (invalid.length > 0) {
      throw AppError.badRequest(`Tipos inválidos: ${invalid.join('; ')}`);
    }

    next();
  };
}

/**
 * Logger de requisições.
 */
export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.originalUrl}`);
  next();
}

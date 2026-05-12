import { Request, Response, NextFunction, RequestHandler } from 'express';
type FieldType = 'string' | 'number' | 'boolean';
type Schema = Record<string, FieldType>;
/**
 * Middleware de validação de body.
 * Verifica que os campos obrigatórios existem e possuem o tipo correto.
 *
 * @example
 * router.post('/', validateBody({ email: 'string', senha: 'string' }), handler)
 */
export declare function validateBody(schema: Schema): RequestHandler;
/**
 * Logger de requisições.
 */
export declare function requestLogger(req: Request, _res: Response, next: NextFunction): void;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map
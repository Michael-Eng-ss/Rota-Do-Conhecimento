import { Request, Response, NextFunction, RequestHandler } from 'express';
/**
 * Envolve um handler async e captura erros automaticamente,
 * passando-os ao próximo middleware de erro do Express.
 */
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler;
//# sourceMappingURL=asyncHandler.d.ts.map
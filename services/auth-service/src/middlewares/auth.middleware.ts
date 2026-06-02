import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../shared/AppError';
import { JWTPayload } from '../shared/types';

export type { JWTPayload };

const JWT_SECRET = process.env.JWT_SECRET || '3099708496ef917af0b641323143ba7a';

function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** Extensão do Request do Express com o payload do JWT. */
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * Middleware de autenticação.
 * Extrai e valida o JWT do header Authorization: Bearer <token>.
 * Popula req.user com o payload decodificado.
 */
export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Token não fornecido'));
  }

  const token   = header.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return next(AppError.unauthorized('Token inválido ou expirado'));
  }

  req.user = decoded;
  next();
}

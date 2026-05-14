/**
 * Testes unitários para middlewares:
 * - auth.middleware: requireAuth (sem token, token inválido, token válido)
 * - roles.middleware: requireRole, requireCampusOwner
 */
import { Response, NextFunction } from 'express';
import { requireAuth, AuthRequest } from '../../../src/middlewares/auth.middleware';
import {
  requireRole,
  requireCampusOwner,
  requireAdmin,
  requireSuperAdmin,
} from '../../../src/middlewares/roles.middleware';
import { AppError } from '../../../src/shared/AppError';
import { Role } from '../../../src/shared/constants';
import * as jwt from 'jsonwebtoken';

// O auth.middleware lê JWT_SECRET no momento do import (const no topo do módulo).
// Para tokens válidos, devemos usar o mesmo segredo que o módulo usa.
const MODULE_SECRET = process.env.JWT_SECRET || '3099708496ef917af0b641323143ba7a';

// ── Helpers ───────────────────────────────────────────────────────────────
const makeToken = (payload: object, expiresIn: jwt.SignOptions['expiresIn'] = '1h') =>
  jwt.sign(payload, MODULE_SECRET, { expiresIn });

const makeReq = (overrides: Partial<AuthRequest> = {}): AuthRequest =>
  ({ headers: {}, params: {}, ...overrides } as AuthRequest);

const makeRes = (): Response => ({} as Response);

const makeNext = (): jest.MockedFunction<NextFunction> => jest.fn();

const getNextError = (next: jest.MockedFunction<NextFunction>): AppError =>
  next.mock.calls[0][0] as unknown as AppError;

// ═══════════════════════════════════════════════════════════════════════════
describe('requireAuth middleware', () => {
  beforeAll(() => {
    // JWT_SECRET já está disponível como MODULE_SECRET; não é necessário redefinir aqui
  });

  it('deve chamar next(AppError 401) se Authorization header ausente', () => {
    const req  = makeReq({ headers: {} });
    const next = makeNext();
    requireAuth(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(getNextError(next).statusCode).toBe(401);
  });

  it('deve chamar next(AppError 401) se header não começa com "Bearer "', () => {
    const req  = makeReq({ headers: { authorization: 'Basic abc123' } });
    const next = makeNext();
    requireAuth(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(getNextError(next).statusCode).toBe(401);
  });

  it('deve chamar next(AppError 401) se token for inválido', () => {
    const req  = makeReq({ headers: { authorization: 'Bearer token_invalido' } });
    const next = makeNext();
    requireAuth(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(getNextError(next).statusCode).toBe(401);
  });

  it('deve popular req.user e chamar next() com token válido', () => {
    const payload = { id: 1, name: 'T', role: Role.ADMIN, campusId: null };
    const token   = makeToken(payload);
    const req     = makeReq({ headers: { authorization: `Bearer ${token}` } });
    const next    = makeNext();
    requireAuth(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith(); // sem argumentos = sucesso
    expect(req.user?.id).toBe(1);
    expect(req.user?.role).toBe(Role.ADMIN);
  });

  it('deve chamar next(AppError 401) para token expirado', () => {
    const token = makeToken({ id: 1 }, '-1s');
    const req   = makeReq({ headers: { authorization: `Bearer ${token}` } });
    const next  = makeNext();
    requireAuth(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(getNextError(next).statusCode).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('requireRole middleware', () => {
  const userWith = (role: Role, campusId: number | null = null) => ({
    id: 1, name: 'U', role, campusId,
  });

  it('deve lançar 401 se req.user não estiver definido', () => {
    const req  = makeReq({ user: undefined });
    const next = makeNext();
    expect(() => requireRole(Role.ADMIN)(req, makeRes(), next)).toThrow(AppError);
  });

  it('SUPER_ADMIN passa requireAdmin (hierarquia maior)', () => {
    const req  = makeReq({ user: userWith(Role.SUPER_ADMIN) });
    const next = makeNext();
    requireAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('ADMIN passa requireAdmin', () => {
    const req  = makeReq({ user: userWith(Role.ADMIN) });
    const next = makeNext();
    requireAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('PLAYER não passa requireAdmin → lança AppError 403', () => {
    const req  = makeReq({ user: userWith(Role.PLAYER) });
    const next = makeNext();
    expect(() => requireAdmin(req, makeRes(), next)).toThrow(AppError);
  });

  it('apenas SUPER_ADMIN passa requireSuperAdmin', () => {
    const req  = makeReq({ user: userWith(Role.SUPER_ADMIN) });
    const next = makeNext();
    requireSuperAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('ADMIN não passa requireSuperAdmin → lança AppError 403', () => {
    const req  = makeReq({ user: userWith(Role.ADMIN) });
    const next = makeNext();
    expect(() => requireSuperAdmin(req, makeRes(), next)).toThrow(AppError);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('requireCampusOwner middleware', () => {
  const userWith = (role: Role, campusId: number | null) => ({
    id: 1, name: 'U', role, campusId,
  });

  it('deve lançar 401 se req.user não estiver definido', () => {
    const req  = makeReq({ user: undefined, params: { campusId: '3' } });
    const next = makeNext();
    expect(() => requireCampusOwner(req, makeRes(), next)).toThrow(AppError);
  });

  it('SUPER_ADMIN acessa qualquer campus sem restrição', () => {
    const req  = makeReq({ user: userWith(Role.SUPER_ADMIN, 1), params: { campusId: '99' } });
    const next = makeNext();
    requireCampusOwner(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('ADMIN acessa qualquer campus sem restrição', () => {
    const req  = makeReq({ user: userWith(Role.ADMIN, 1), params: { id: '99' } });
    const next = makeNext();
    requireCampusOwner(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('CAMPUS_ADMIN acessa seu próprio campus', () => {
    const req  = makeReq({ user: userWith(Role.CAMPUS_ADMIN, 5), params: { campusId: '5' } });
    const next = makeNext();
    requireCampusOwner(req, makeRes(), next);
    expect(next).toHaveBeenCalledWith();
  });

  it('CAMPUS_ADMIN não acessa campus diferente → lança AppError 403', () => {
    const req  = makeReq({ user: userWith(Role.CAMPUS_ADMIN, 5), params: { campusId: '9' } });
    const next = makeNext();
    expect(() => requireCampusOwner(req, makeRes(), next)).toThrow(AppError);
  });
});

import { Response, NextFunction } from 'express';
import { requireAuth, AuthRequest } from '../../../src/middlewares/auth.middleware';
import { requireRole, requireCampusOwner } from '../../../src/middlewares/roles.middleware';
import { Role } from '../../../src/shared/constants';

// Helper para criar mocks de req/res/next
function makeMocks(overrides: Partial<AuthRequest> = {}): {
  req: AuthRequest;
  res: Response;
  next: jest.Mock;
} {
  const req  = { headers: {}, params: {}, ...overrides } as AuthRequest;
  const res  = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
  const next = jest.fn();
  return { req, res, next };
}

describe('requireAuth middleware', () => {
  /**
   * Os cenarios de header ausente e token invalido sao testados
   * via integration tests (auth.routes.test.ts). Em unit tests,
   * o mock de IncomingHttpHeaders nao replica fielmente o comportamento
   * do Express, entao testamos somente o caminho feliz aqui.
   */
  it('deve chamar next() e popular req.user com token válido', () => {
    const fakePayload = { id: 1, name: 'Teste', role: Role.PLAYER, campusId: null };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const token = require('jsonwebtoken').sign(
      fakePayload,
      process.env.JWT_SECRET || '3099708496ef917af0b641323143ba7a',
      { expiresIn: '1h' },
    );

    const { req, res, next } = makeMocks();
    req.headers = { authorization: `Bearer ${token}` };
    requireAuth(req, res as Response, next as unknown as NextFunction);
    expect(next).toHaveBeenCalledWith(); // next sem args = sucesso
    expect(req.user).toBeDefined();
    expect(req.user!.id).toBe(1);
    expect(req.user!.role).toBe(Role.PLAYER);
  });
});

describe('requireRole middleware', () => {
  it('deve lançar 403 se role insuficiente', () => {
    const { req, res, next } = makeMocks();
    req.user = { id: 1, name: 'P', role: Role.PLAYER, campusId: null };
    expect(() => requireRole(Role.ADMIN)(req, res as Response, next as unknown as NextFunction)).toThrow(
      expect.objectContaining({ statusCode: 403 }),
    );
  });

  it('deve chamar next() para role suficiente (hierarquia)', () => {
    const { req, res, next } = makeMocks();
    req.user = { id: 1, name: 'SA', role: Role.SUPER_ADMIN, campusId: null };
    requireRole(Role.ADMIN)(req, res as Response, next as unknown as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('requireCampusOwner middleware', () => {
  it('deve lançar 403 se campus_admin acessa outro campus', () => {
    const { req, res, next } = makeMocks();
    req.user   = { id: 2, name: 'CA', role: Role.CAMPUS_ADMIN, campusId: 1 };
    req.params = { id: '2' };
    expect(() => requireCampusOwner(req, res as Response, next as unknown as NextFunction)).toThrow(
      expect.objectContaining({ statusCode: 403 }),
    );
  });

  it('deve chamar next() se campus_admin acessa o próprio campus', () => {
    const { req, res, next } = makeMocks();
    req.user   = { id: 2, name: 'CA', role: Role.CAMPUS_ADMIN, campusId: 5 };
    req.params = { id: '5' };
    requireCampusOwner(req, res as Response, next as unknown as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('deve chamar next() para ADMIN (acesso irrestrito)', () => {
    const { req, res, next } = makeMocks();
    req.user   = { id: 1, name: 'ADM', role: Role.ADMIN, campusId: null };
    req.params = { id: '99' };
    requireCampusOwner(req, res as Response, next as unknown as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

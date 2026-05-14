/**
 * Testes unitários complementares para AuthService
 * Cobrindo: forgotPassword, resetPassword, verifyEmail, emailVerified check
 */
import { AuthService } from '../../../src/services/AuthService';
import { UsuarioRepository } from '../../../src/repositories/UsuarioRepository';
import { LogRepository } from '../../../src/repositories/LogRepository';
import { EmailTokenRepository } from '../../../src/repositories/EmailTokenRepository';
import { AppError } from '../../../src/shared/AppError';
import { Role } from '../../../src/shared/constants';
import * as bcrypt from 'bcrypt';

// ── Mocks ─────────────────────────────────────────────────────────────────
jest.mock('../../../src/repositories/UsuarioRepository');
jest.mock('../../../src/repositories/LogRepository');
jest.mock('../../../src/repositories/EmailTokenRepository');
jest.mock('../../../src/services/EmailService');

const MockUsuarioRepo    = UsuarioRepository    as jest.MockedClass<typeof UsuarioRepository>;
const MockLogRepo        = LogRepository        as jest.MockedClass<typeof LogRepository>;
const MockEmailTokenRepo = EmailTokenRepository as jest.MockedClass<typeof EmailTokenRepository>;

const makePlayer = async (overrides = {}) => ({
  id: 1, email: 'p@p.com', nome: 'Player',
  senha: await bcrypt.hash('senha123', 4),
  role: Role.PLAYER, status: true,
  campusId: null, cursoId: null, emailVerified: true,
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AuthService.login() — emailVerified check', () => {
  let service: AuthService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockLogRepo.mockClear();
    service  = new AuthService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve lançar 403 se PLAYER com emailVerified=false tentar logar', async () => {
    mockRepo.findByEmailWithPassword.mockResolvedValue(
      await makePlayer({ emailVerified: false }) as never,
    );
    await expect(service.login('p@p.com', 'senha123'))
      .rejects.toMatchObject({ statusCode: 403 });
  });

  it('ADMIN não verificado pode logar mesmo assim (emailVerified só bloqueia PLAYER)', async () => {
    const mockLog = MockLogRepo.mock.instances[0] as jest.Mocked<LogRepository>;
    mockRepo.findByEmailWithPassword.mockResolvedValue(
      await makePlayer({ role: Role.ADMIN, emailVerified: false }) as never,
    );
    mockLog.create.mockResolvedValue({} as never);
    const result = await service.login('p@p.com', 'senha123');
    expect(result).toHaveProperty('token');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AuthService.forgotPassword()', () => {
  let service: AuthService;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockTokenRepo: jest.Mocked<EmailTokenRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockLogRepo.mockClear();
    MockEmailTokenRepo.mockClear();
    service       = new AuthService({} as never);
    mockRepo      = MockUsuarioRepo.mock.instances[0]    as jest.Mocked<UsuarioRepository>;
    mockTokenRepo = MockEmailTokenRepo.mock.instances[0] as jest.Mocked<EmailTokenRepository>;
  });

  it('deve retornar mensagem genérica se e-mail não existir (não revela existência)', async () => {
    mockRepo.findByEmailWithPassword.mockResolvedValue(null);
    const result = await service.forgotPassword('inexistente@mail.com');
    expect(result.message).toMatch(/se o e-mail/i);
    expect(mockTokenRepo.create).not.toHaveBeenCalled();
  });

  it('deve criar token e retornar mensagem genérica se e-mail existir', async () => {
    mockRepo.findByEmailWithPassword.mockResolvedValue(
      await makePlayer() as never,
    );
    mockTokenRepo.create.mockResolvedValue('token-abc' as never);
    const result = await service.forgotPassword('p@p.com');
    expect(result.message).toMatch(/se o e-mail/i);
    expect(mockTokenRepo.create).toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AuthService.resetPassword()', () => {
  let service: AuthService;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockTokenRepo: jest.Mocked<EmailTokenRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockEmailTokenRepo.mockClear();
    service       = new AuthService({} as never);
    mockRepo      = MockUsuarioRepo.mock.instances[0]    as jest.Mocked<UsuarioRepository>;
    mockTokenRepo = MockEmailTokenRepo.mock.instances[0] as jest.Mocked<EmailTokenRepository>;
  });

  it('deve lançar 400 para token inválido ou expirado', async () => {
    mockTokenRepo.findValid.mockResolvedValue(null);
    await expect(service.resetPassword('token-invalido', 'novaSenha123'))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  it('deve atualizar a senha e marcar token como usado', async () => {
    mockTokenRepo.findValid.mockResolvedValue({ usuarioId: 5, token: 'tok' } as never);
    mockRepo.updatePassword.mockResolvedValue(true);
    mockTokenRepo.markUsed.mockResolvedValue(undefined as never);

    const result = await service.resetPassword('tok', 'novaSenha!123');
    expect(result.message).toMatch(/senha atualizada/i);
    expect(mockRepo.updatePassword).toHaveBeenCalledWith(
      5,
      expect.stringMatching(/^\$2b\$/), // bcrypt
    );
    expect(mockTokenRepo.markUsed).toHaveBeenCalledWith('tok');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AuthService.verifyEmail()', () => {
  let service: AuthService;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockTokenRepo: jest.Mocked<EmailTokenRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockEmailTokenRepo.mockClear();
    service       = new AuthService({} as never);
    mockRepo      = MockUsuarioRepo.mock.instances[0]    as jest.Mocked<UsuarioRepository>;
    mockTokenRepo = MockEmailTokenRepo.mock.instances[0] as jest.Mocked<EmailTokenRepository>;
  });

  it('deve lançar 400 para link de verificação inválido', async () => {
    mockTokenRepo.findValid.mockResolvedValue(null);
    await expect(service.verifyEmail('link-invalido'))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  it('deve marcar e-mail como verificado e consumir o token', async () => {
    mockTokenRepo.findValid.mockResolvedValue({ usuarioId: 7, token: 'vt' } as never);
    mockRepo.update.mockResolvedValue({} as never);
    mockTokenRepo.markUsed.mockResolvedValue(undefined as never);

    const result = await service.verifyEmail('vt');
    expect(result.message).toMatch(/verificado/i);
    expect(mockRepo.update).toHaveBeenCalledWith(7, { emailVerified: true });
    expect(mockTokenRepo.markUsed).toHaveBeenCalledWith('vt');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AuthService.verifyToken() — casos adicionais', () => {
  // AuthService lê JWT_SECRET no momento do import. Usamos o mesmo segredo
  // definido no topo do módulo (process.env ou o default hardcoded).
  const SIGNING_SECRET = process.env.JWT_SECRET || '3099708496ef917af0b641323143ba7a';

  it('deve decodificar um JWT válido e retornar o payload', () => {
    const jwt = require('jsonwebtoken');
    const payload = { id: 1, name: 'T', role: Role.ADMIN, campusId: null };
    const token = jwt.sign(payload, SIGNING_SECRET, { expiresIn: '1h' });
    const result = AuthService.verifyToken(token);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.role).toBe(Role.ADMIN);
  });

  it('deve retornar null para token expirado', () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 1 }, SIGNING_SECRET, { expiresIn: '-1s' });
    const result = AuthService.verifyToken(token);
    expect(result).toBeNull();
  });
});

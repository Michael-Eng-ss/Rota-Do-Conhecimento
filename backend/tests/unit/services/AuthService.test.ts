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

const MockUsuarioRepo = UsuarioRepository as jest.MockedClass<typeof UsuarioRepository>;
const MockLogRepo     = LogRepository     as jest.MockedClass<typeof LogRepository>;

describe('AuthService.login()', () => {
  let service: AuthService;
  let mockUsuarioRepo: jest.Mocked<UsuarioRepository>;
  let mockLogRepo: jest.Mocked<LogRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockLogRepo.mockClear();

    // DataSource mock (não usado diretamente — repos são mockados)
    service = new AuthService({} as never);

    mockUsuarioRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
    mockLogRepo     = MockLogRepo.mock.instances[0]     as jest.Mocked<LogRepository>;
  });

  it('deve lançar 401 se e-mail não encontrado', async () => {
    mockUsuarioRepo.findByEmailWithPassword.mockResolvedValue(null);

    await expect(service.login('nao@existe.com', 'qualquer')).rejects.toThrow(AppError);
    await expect(service.login('nao@existe.com', 'qualquer')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('deve lançar 403 se usuário estiver desativado', async () => {
    mockUsuarioRepo.findByEmailWithPassword.mockResolvedValue({
      id: 1, email: 'x@y.com', nome: 'X',
      senha: await bcrypt.hash('senha', 4),
      role: Role.PLAYER, status: false,
      campusId: null, cursoId: null,
    } as never);

    await expect(service.login('x@y.com', 'senha')).rejects.toMatchObject({ statusCode: 403 });
  });

  it('deve lançar 401 se senha errada (bcrypt)', async () => {
    const hash = await bcrypt.hash('correta', 4);
    mockUsuarioRepo.findByEmailWithPassword.mockResolvedValue({
      id: 1, email: 'u@u.com', nome: 'U',
      senha: hash, role: Role.PLAYER, status: true,
      campusId: null, cursoId: null,
    } as never);

    await expect(service.login('u@u.com', 'errada')).rejects.toMatchObject({ statusCode: 401 });
  });

  it('deve retornar token + role + campusId em login válido', async () => {
    const hash = await bcrypt.hash('senha123', 4);
    mockUsuarioRepo.findByEmailWithPassword.mockResolvedValue({
      id: 42, email: 'admin@c.com', nome: 'Admin',
      senha: hash, role: Role.ADMIN, status: true,
      campusId: 7, cursoId: null,
    } as never);
    mockLogRepo.create.mockResolvedValue({} as never);

    const result = await service.login('admin@c.com', 'senha123');

    expect(result).toHaveProperty('token');
    expect(result.role).toBe(Role.ADMIN);
    expect(result.campusId).toBe(7);
    expect(result.user).not.toHaveProperty('senha');
  });

  it('deve fazer re-hash de senha SHA-256 legada para bcrypt', async () => {
    // SHA-256 de "legacypassword"
    const sha256hash = require('crypto').createHash('sha256').update('legacypassword').digest('hex');
    mockUsuarioRepo.findByEmailWithPassword.mockResolvedValue({
      id: 99, email: 'legacy@c.com', nome: 'Legacy',
      senha: sha256hash, role: Role.PLAYER, status: true,
      campusId: null, cursoId: null,
    } as never);
    mockUsuarioRepo.updatePassword.mockResolvedValue(true);
    mockLogRepo.create.mockResolvedValue({} as never);

    const result = await service.login('legacy@c.com', 'legacypassword');

    // Deve ter re-hashado para bcrypt
    expect(mockUsuarioRepo.updatePassword).toHaveBeenCalledWith(
      99,
      expect.stringMatching(/^\$2b\$/), // bcrypt prefix
    );
    expect(result).toHaveProperty('token');
  });
});

describe('AuthService.verifyToken()', () => {
  it('deve retornar null para token inválido', () => {
    const result = AuthService.verifyToken('token_invalido_qualquer');
    expect(result).toBeNull();
  });
});

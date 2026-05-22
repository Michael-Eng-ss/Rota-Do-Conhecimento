import { UsuarioService } from '../../../src/services/UsuarioService';
import { UsuarioRepository } from '../../../src/repositories/UsuarioRepository';
import { CampusRepository } from '../../../src/repositories/CampusRepository';
import { EmailTokenRepository } from '../../../src/repositories/EmailTokenRepository';
import { AppError } from '../../../src/shared/AppError';
import { Role } from '../../../src/shared/constants';

// ── Mocks ─────────────────────────────────────────────────────────────────
jest.mock('../../../src/repositories/UsuarioRepository');
jest.mock('../../../src/repositories/CampusRepository');
jest.mock('../../../src/repositories/EmailTokenRepository');
jest.mock('../../../src/services/EmailService');

const MockUsuarioRepo = UsuarioRepository as jest.MockedClass<typeof UsuarioRepository>;
const MockCampusRepo  = CampusRepository  as jest.MockedClass<typeof CampusRepository>;

// ── Helpers ───────────────────────────────────────────────────────────────
const fakeUser = (overrides = {}) => ({
  id: 1, nome: 'Teste', email: 'teste@mail.com', role: Role.PLAYER,
  pontuacao: 0, status: true, campusId: null, cursoId: null,
  emailVerified: true, foto: null, telefone: null, sexo: 0,
  datanascimento: null, uf: null, cidade: null, turma: null, periodo: null,
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.getById()', () => {
  let service: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    service  = new UsuarioService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve retornar usuário sem senha', async () => {
    mockRepo.findByIdWithRelations.mockResolvedValue(fakeUser({ senha: 'hash' }) as never);
    const result = await service.getById(1);
    expect(result).not.toHaveProperty('senha');
    expect(result.id).toBe(1);
  });

  it('deve lançar 404 se usuário não existir', async () => {
    mockRepo.findByIdWithRelations.mockResolvedValue(null);
    await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.create()', () => {
  let service: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockCampus: jest.Mocked<CampusRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service    = new UsuarioService({} as never);
    mockRepo   = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
    mockCampus = MockCampusRepo.mock.instances[0]  as jest.Mocked<CampusRepository>;
  });

  it('deve lançar 409 se e-mail já estiver cadastrado', async () => {
    mockRepo.existsByEmail.mockResolvedValue(true);
    await expect(
      service.create({ nome: 'A', email: 'dup@mail.com', senha: '123', campusId: 1 }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('deve lançar 400 se campusId fornecido não existir', async () => {
    mockRepo.existsByEmail.mockResolvedValue(false);
    mockCampus.findById.mockResolvedValue(null);
    await expect(
      service.create({ nome: 'A', email: 'a@b.com', senha: '123', campusId: 99 }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('deve criar usuário e retornar sem senha', async () => {
    mockRepo.existsByEmail.mockResolvedValue(false);
    mockRepo.create.mockResolvedValue(fakeUser({ id: 5, senha: 'bcrypt' }) as never);
    mockCampus.findById.mockResolvedValue({ id: 1, nome: 'Campus Teste' } as never);
    const result = await service.create({ nome: 'Novo', email: 'novo@mail.com', senha: 'abc', campusId: 1 });
    expect(result).not.toHaveProperty('senha');
    expect(result.id).toBe(5);
  });

  it('deve criar usuário com role=PLAYER sempre', async () => {
    mockRepo.existsByEmail.mockResolvedValue(false);
    mockRepo.create.mockImplementation(async (data) => ({ ...fakeUser(), ...data }) as never);
    mockCampus.findById.mockResolvedValue({ id: 1, nome: 'Campus Teste' } as never);
    const result = await service.create({ nome: 'X', email: 'x@mail.com', senha: 'x', campusId: 1 });
    expect(result.role).toBe(Role.PLAYER);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.update()', () => {
  let service: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockCampus: jest.Mocked<CampusRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service    = new UsuarioService({} as never);
    mockRepo   = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
    mockCampus = MockCampusRepo.mock.instances[0]  as jest.Mocked<CampusRepository>;
  });

  it('deve lançar 404 se usuário não existir', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.update(1, { nome: 'X' })).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deve lançar 400 ao mudar campusId para um campus inexistente', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ campusId: 1 }) as never);
    mockCampus.findById.mockResolvedValue(null);
    await expect(service.update(1, { campusId: 99 })).rejects.toMatchObject({ statusCode: 400 });
  });

  it('deve atualizar e retornar sem senha', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser() as never);
    mockRepo.update.mockResolvedValue(fakeUser({ nome: 'Atualizado', senha: 'hash' }) as never);
    const result = await service.update(1, { nome: 'Atualizado' });
    expect(result.nome).toBe('Atualizado');
    expect(result).not.toHaveProperty('senha');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.updateScore()', () => {
  let service: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    service  = new UsuarioService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve lançar 404 se usuário não existir', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.updateScore(99, 10)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deve retornar usuário com pontuação atualizada', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ pontuacao: 50 }) as never);
    mockRepo.updateScore.mockResolvedValue(fakeUser({ pontuacao: 60 }) as never);
    const result = await service.updateScore(1, 10);
    expect(result.pontuacao).toBe(60);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.deactivate()', () => {
  let service: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    service  = new UsuarioService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve lançar 404 se usuário não existir', async () => {
    mockRepo.deactivate.mockResolvedValue(false);
    await expect(service.deactivate(99)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deve retornar mensagem de sucesso ao desativar', async () => {
    mockRepo.deactivate.mockResolvedValue(true);
    const result = await service.deactivate(1);
    expect(result.message).toMatch(/desativado/i);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.canEditUser() — método estático', () => {
  it('deve permitir o próprio usuário editar a si mesmo', () => {
    expect(UsuarioService.canEditUser(1, Role.PLAYER, 1)).toBe(true);
  });

  it('deve permitir ADMIN editar outros usuários', () => {
    expect(UsuarioService.canEditUser(1, Role.ADMIN, 2)).toBe(true);
  });

  it('não deve permitir PLAYER editar outro usuário', () => {
    expect(UsuarioService.canEditUser(1, Role.PLAYER, 2)).toBe(false);
  });
});

import { AdminService } from '../../../src/services/AdminService';
import { UsuarioRepository } from '../../../src/repositories/UsuarioRepository';
import { CampusRepository } from '../../../src/repositories/CampusRepository';
import { AppError } from '../../../src/shared/AppError';
import { Role } from '../../../src/shared/constants';

// ── Mocks ─────────────────────────────────────────────────────────────────
jest.mock('../../../src/repositories/UsuarioRepository');
jest.mock('../../../src/repositories/CampusRepository');

const MockUsuarioRepo = UsuarioRepository as jest.MockedClass<typeof UsuarioRepository>;
const MockCampusRepo  = CampusRepository  as jest.MockedClass<typeof CampusRepository>;

// ── Helpers ───────────────────────────────────────────────────────────────
const makeRequester = (role: Role, id = 1) => ({ id, name: 'X', role, campusId: null });

const fakeUser = (overrides = {}) => ({
  id: 10, nome: 'Admin Teste', email: 'admin@mail.com',
  role: Role.ADMIN, pontuacao: 0, status: true,
  campusId: null, cursoId: null, emailVerified: true,
  foto: null, telefone: null, ...overrides,
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AdminService.createAdmin()', () => {
  let service: AdminService;
  let mockRepo: jest.Mocked<UsuarioRepository>;
  let mockCampus: jest.Mocked<CampusRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service    = new AdminService({} as never);
    mockRepo   = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
    mockCampus = MockCampusRepo.mock.instances[0]  as jest.Mocked<CampusRepository>;
  });

  it('deve lançar 403 se requester tentar criar role >= ao seu', async () => {
    const requester = makeRequester(Role.ADMIN); // hierarquia 3
    await expect(
      service.createAdmin(
        { nome: 'S', email: 's@s.com', senha: '123', role: Role.SUPER_ADMIN },
        requester,
      ),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('deve lançar 409 se e-mail já cadastrado', async () => {
    mockRepo.existsByEmail.mockResolvedValue(true);
    const requester = makeRequester(Role.SUPER_ADMIN);
    await expect(
      service.createAdmin(
        { nome: 'A', email: 'dup@mail.com', senha: '123', role: Role.ADMIN },
        requester,
      ),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('deve lançar 400 se campus_admin não tiver campusId', async () => {
    mockRepo.existsByEmail.mockResolvedValue(false);
    const requester = makeRequester(Role.SUPER_ADMIN);
    await expect(
      service.createAdmin(
        { nome: 'CA', email: 'ca@mail.com', senha: '123', role: Role.CAMPUS_ADMIN },
        requester,
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('deve lançar 400 se campusId fornecido não existir', async () => {
    mockRepo.existsByEmail.mockResolvedValue(false);
    mockCampus.findById.mockResolvedValue(null);
    const requester = makeRequester(Role.SUPER_ADMIN);
    await expect(
      service.createAdmin(
        { nome: 'CA', email: 'ca@mail.com', senha: '123', role: Role.CAMPUS_ADMIN, campusId: 999 },
        requester,
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('deve criar admin e retornar sem senha', async () => {
    mockRepo.existsByEmail.mockResolvedValue(false);
    mockRepo.create.mockResolvedValue(fakeUser({ senha: 'hash' }) as never);
    const requester = makeRequester(Role.SUPER_ADMIN);
    const result = await service.createAdmin(
      { nome: 'Admin', email: 'a@mail.com', senha: '123', role: Role.ADMIN },
      requester,
    );
    expect(result).not.toHaveProperty('senha');
    expect(result.id).toBe(10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AdminService.promoteUser()', () => {
  let service: AdminService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service  = new AdminService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve lançar 403 se tentar promover para role >= ao requester', async () => {
    const requester = makeRequester(Role.ADMIN);
    await expect(
      service.promoteUser(2, Role.SUPER_ADMIN, requester),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('deve lançar 404 se alvo não existir', async () => {
    mockRepo.findById.mockResolvedValue(null);
    const requester = makeRequester(Role.SUPER_ADMIN);
    await expect(
      service.promoteUser(99, Role.ADMIN, requester),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deve lançar 403 ao tentar alterar role de usuário com hierarquia >= requester', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.SUPER_ADMIN }) as never);
    const requester = makeRequester(Role.ADMIN);
    await expect(
      service.promoteUser(10, Role.CAMPUS_ADMIN, requester),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('deve promover usuário com sucesso', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.PLAYER }) as never);
    mockRepo.updateRole.mockResolvedValue(true);
    const requester = makeRequester(Role.SUPER_ADMIN);
    const result = await service.promoteUser(10, Role.ADMIN, requester);
    expect(result.message).toMatch(/promovido/i);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AdminService.updateUser()', () => {
  let service: AdminService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    service  = new AdminService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve lançar 404 se alvo não existir', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(
      service.updateUser(99, { nome: 'X' }, makeRequester(Role.SUPER_ADMIN)),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deve lançar 403 ao editar usuário com hierarquia >= ao do requester', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.SUPER_ADMIN }) as never);
    await expect(
      service.updateUser(10, { nome: 'X' }, makeRequester(Role.ADMIN, 2)),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('deve lançar 409 se novo e-mail já em uso', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.PLAYER }) as never);
    mockRepo.existsByEmail.mockResolvedValue(true);
    await expect(
      service.updateUser(10, { email: 'dup@mail.com' }, makeRequester(Role.SUPER_ADMIN)),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('deve atualizar e retornar sem senha', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.PLAYER }) as never);
    mockRepo.existsByEmail.mockResolvedValue(false);
    mockRepo.update.mockResolvedValue(fakeUser({ nome: 'Novo', senha: 'hash' }) as never);
    const result = await service.updateUser(10, { nome: 'Novo' }, makeRequester(Role.SUPER_ADMIN));
    expect(result.nome).toBe('Novo');
    expect(result).not.toHaveProperty('senha');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AdminService.toggleStatus()', () => {
  let service: AdminService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    service  = new AdminService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve lançar 404 se usuário não existir', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(
      service.toggleStatus(99, false, makeRequester(Role.SUPER_ADMIN)),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deve lançar 403 ao tentar alterar status de usuário com hierarquia >= requester', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.SUPER_ADMIN }) as never);
    await expect(
      service.toggleStatus(10, false, makeRequester(Role.ADMIN, 2)),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('deve desativar usuário com sucesso', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.PLAYER }) as never);
    mockRepo.setStatus.mockResolvedValue(true);
    const result = await service.toggleStatus(10, false, makeRequester(Role.SUPER_ADMIN));
    expect(result.message).toMatch(/desativado/i);
  });

  it('deve ativar usuário com sucesso', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser({ role: Role.PLAYER, status: false }) as never);
    mockRepo.setStatus.mockResolvedValue(true);
    const result = await service.toggleStatus(10, true, makeRequester(Role.SUPER_ADMIN));
    expect(result.message).toMatch(/ativado/i);
  });
});

/**
 * Testes unitários complementares para AdminService e UsuarioService
 * Cobrindo: listAll, listByCampus, updatePassword, findByCurso
 */
import { AdminService } from '../../../src/services/AdminService';
import { UsuarioService } from '../../../src/services/UsuarioService';
import { UsuarioRepository } from '../../../src/repositories/UsuarioRepository';
import { CampusRepository } from '../../../src/repositories/CampusRepository';
import { Role } from '../../../src/shared/constants';

jest.mock('../../../src/repositories/UsuarioRepository');
jest.mock('../../../src/repositories/CampusRepository');
jest.mock('../../../src/repositories/EmailTokenRepository');
jest.mock('../../../src/services/EmailService');

const MockUsuarioRepo = UsuarioRepository as jest.MockedClass<typeof UsuarioRepository>;
const MockCampusRepo  = CampusRepository  as jest.MockedClass<typeof CampusRepository>;

const fakeUser = (overrides = {}) => ({
  id: 1, nome: 'U', email: 'u@u.com', role: Role.PLAYER,
  pontuacao: 0, status: true, campusId: null, cursoId: null,
  emailVerified: true, foto: null, telefone: null, senha: 'hash',
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AdminService.listAll()', () => {
  let service: AdminService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service  = new AdminService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve retornar todos os usuários sem senha', async () => {
    mockRepo.findAllForAdmin.mockResolvedValue([
      fakeUser({ id: 1 }),
      fakeUser({ id: 2, role: Role.ADMIN }),
    ] as never);

    const result = await service.listAll();
    expect(result).toHaveLength(2);
    result.forEach((u) => expect(u).not.toHaveProperty('senha'));
  });

  it('deve retornar lista vazia quando não há usuários', async () => {
    mockRepo.findAllForAdmin.mockResolvedValue([]);
    const result = await service.listAll();
    expect(result).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AdminService.listByCampus()', () => {
  let service: AdminService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service  = new AdminService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve retornar usuários do campus sem senha', async () => {
    mockRepo.findByCampus.mockResolvedValue([
      fakeUser({ campusId: 3 }),
      fakeUser({ id: 2, campusId: 3 }),
    ] as never);

    const result = await service.listByCampus(3);
    expect(result).toHaveLength(2);
    expect(mockRepo.findByCampus).toHaveBeenCalledWith(3);
    result.forEach((u) => expect(u).not.toHaveProperty('senha'));
  });

  it('deve retornar lista vazia para campus sem usuários', async () => {
    mockRepo.findByCampus.mockResolvedValue([]);
    const result = await service.listByCampus(99);
    expect(result).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('AdminService.getUserById()', () => {
  let service: AdminService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service  = new AdminService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve retornar usuário sem senha', async () => {
    mockRepo.findByIdWithRelations.mockResolvedValue(fakeUser({ id: 7 }) as never);
    const result = await service.getUserById(7);
    expect(result.id).toBe(7);
    expect(result).not.toHaveProperty('senha');
  });

  it('deve lançar 404 se não encontrado', async () => {
    mockRepo.findByIdWithRelations.mockResolvedValue(null);
    await expect(service.getUserById(99)).rejects.toMatchObject({ statusCode: 404 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.updatePassword()', () => {
  let service: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service  = new UsuarioService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve lançar 404 se usuário não existir', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.updatePassword(99, 'novaSenha')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deve atualizar senha com hash bcrypt', async () => {
    mockRepo.findById.mockResolvedValue(fakeUser() as never);
    mockRepo.updatePassword.mockResolvedValue(true);

    const result = await service.updatePassword(1, 'novaSenha!');
    expect(result.message).toMatch(/senha atualizada/i);
    expect(mockRepo.updatePassword).toHaveBeenCalledWith(
      1,
      expect.stringMatching(/^\$2b\$/),
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('UsuarioService.findByCurso()', () => {
  let service: UsuarioService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    MockCampusRepo.mockClear();
    service  = new UsuarioService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  it('deve retornar lista de usuários sem senha', async () => {
    mockRepo.findByCurso.mockResolvedValue([
      fakeUser({ cursoId: 2 }),
      fakeUser({ id: 2, cursoId: 2 }),
    ] as never);

    const result = await service.findByCurso(2);
    expect(result).toHaveLength(2);
    result.forEach((u) => expect(u).not.toHaveProperty('senha'));
    expect(mockRepo.findByCurso).toHaveBeenCalledWith(2, 0, 20);
  });

  it('deve repassar skip e take ao repositório', async () => {
    mockRepo.findByCurso.mockResolvedValue([]);
    await service.findByCurso(1, 10, 5);
    expect(mockRepo.findByCurso).toHaveBeenCalledWith(1, 10, 5);
  });

  it('deve retornar lista vazia se curso não tiver usuários', async () => {
    mockRepo.findByCurso.mockResolvedValue([]);
    const result = await service.findByCurso(99);
    expect(result).toEqual([]);
  });
});

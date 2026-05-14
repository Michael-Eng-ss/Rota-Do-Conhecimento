import { CursoService } from '../../../src/services/CursoService';
import { CursoRepository } from '../../../src/repositories/CursoRepository';
import { AppError } from '../../../src/shared/AppError';

// ── Mocks ─────────────────────────────────────────────────────────────────
jest.mock('../../../src/repositories/CursoRepository');

const MockCursoRepo = CursoRepository as jest.MockedClass<typeof CursoRepository>;

const fakeCurso = (id = 1, nome = 'Engenharia') => ({ id, nome });

// ═══════════════════════════════════════════════════════════════════════════
describe('CursoService', () => {
  let service: CursoService;
  let mockRepo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    MockCursoRepo.mockClear();
    service  = new CursoService({} as never);
    mockRepo = MockCursoRepo.mock.instances[0] as jest.Mocked<CursoRepository>;
  });

  // ── getAll ────────────────────────────────────────────────────────────
  describe('getAll()', () => {
    it('deve retornar lista de cursos', async () => {
      mockRepo.findAll.mockResolvedValue([fakeCurso(1), fakeCurso(2, 'Medicina')] as never);
      const result = await service.getAll();
      expect(result).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há cursos', async () => {
      mockRepo.findAll.mockResolvedValue([]);
      const result = await service.getAll();
      expect(result).toEqual([]);
    });
  });

  // ── getById ───────────────────────────────────────────────────────────
  describe('getById()', () => {
    it('deve retornar o curso pelo id', async () => {
      mockRepo.findById.mockResolvedValue(fakeCurso() as never);
      const result = await service.getById(1);
      expect(result.nome).toBe('Engenharia');
    });

    it('deve lançar 404 se curso não existir', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── create ────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('deve lançar 400 se nome estiver vazio', () => {
      expect(() => service.create({ nome: '' })).toThrow(AppError);
      expect(() => service.create({ nome: '' })).toThrow('Nome do curso é obrigatório');
    });

    it('deve lançar 400 se nome for apenas espaços', () => {
      expect(() => service.create({ nome: '   ' })).toThrow(AppError);
    });

    it('deve criar curso com sucesso', async () => {
      mockRepo.create.mockResolvedValue(fakeCurso(5, 'Direito') as never);
      const result = await service.create({ nome: 'Direito' });
      expect(result.id).toBe(5);
      expect(result.nome).toBe('Direito');
    });
  });

  // ── update ────────────────────────────────────────────────────────────
  describe('update()', () => {
    it('deve lançar 404 se curso não existir', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update(99, { nome: 'Novo' })).rejects.toMatchObject({ statusCode: 404 });
    });

    it('deve atualizar curso com sucesso', async () => {
      mockRepo.findById.mockResolvedValue(fakeCurso() as never);
      mockRepo.update.mockResolvedValue(fakeCurso(1, 'Engenharia Civil') as never);
      const result = await service.update(1, { nome: 'Engenharia Civil' });
      expect(result.nome).toBe('Engenharia Civil');
    });
  });

  // ── delete ────────────────────────────────────────────────────────────
  describe('delete()', () => {
    it('deve lançar 404 se curso não existir', async () => {
      mockRepo.delete.mockResolvedValue(false);
      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('deve deletar com sucesso e retornar mensagem', async () => {
      mockRepo.delete.mockResolvedValue(true);
      const result = await service.delete(1);
      expect(result.message).toMatch(/removido/i);
    });
  });
});

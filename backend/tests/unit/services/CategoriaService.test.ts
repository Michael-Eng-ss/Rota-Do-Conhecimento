import { CategoriaService } from '../../../src/services/CategoriaService';
import { CategoriaRepository } from '../../../src/repositories/CategoriaRepository';
import { AppError } from '../../../src/shared/AppError';

// ── Mocks ─────────────────────────────────────────────────────────────────
jest.mock('../../../src/repositories/CategoriaRepository');

const MockCategoriaRepo = CategoriaRepository as jest.MockedClass<typeof CategoriaRepository>;

const fakeCategoria = (id = 1, descricao = 'Matemática', cursoid = 1) =>
  ({ id, descricao, cursoid, status: true });

// ═══════════════════════════════════════════════════════════════════════════
describe('CategoriaService', () => {
  let service: CategoriaService;
  let mockRepo: jest.Mocked<CategoriaRepository>;

  beforeEach(() => {
    MockCategoriaRepo.mockClear();
    service  = new CategoriaService({} as never);
    mockRepo = MockCategoriaRepo.mock.instances[0] as jest.Mocked<CategoriaRepository>;
  });

  // ── getAll ────────────────────────────────────────────────────────────
  describe('getAll()', () => {
    it('deve retornar lista de categorias', async () => {
      mockRepo.findAll.mockResolvedValue([fakeCategoria(), fakeCategoria(2, 'Física')] as never);
      const result = await service.getAll();
      expect(result).toHaveLength(2);
    });
  });

  // ── getByCurso ────────────────────────────────────────────────────────
  describe('getByCurso()', () => {
    it('deve filtrar categorias pelo cursoid', async () => {
      mockRepo.findByCurso.mockResolvedValue([fakeCategoria()] as never);
      const result = await service.getByCurso(1);
      expect(mockRepo.findByCurso).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
    });

    it('deve retornar lista vazia se o curso não tiver categorias', async () => {
      mockRepo.findByCurso.mockResolvedValue([]);
      const result = await service.getByCurso(99);
      expect(result).toEqual([]);
    });
  });

  // ── getById ───────────────────────────────────────────────────────────
  describe('getById()', () => {
    it('deve retornar a categoria pelo id', async () => {
      mockRepo.findById.mockResolvedValue(fakeCategoria() as never);
      const result = await service.getById(1);
      expect(result.descricao).toBe('Matemática');
    });

    it('deve lançar 404 se categoria não existir', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── create ────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('deve lançar 400 se descrição estiver vazia', () => {
      expect(() => service.create({ descricao: '', cursoid: 1 })).toThrow(AppError);
      expect(() => service.create({ descricao: '', cursoid: 1 })).toThrow('Descrição da categoria é obrigatória');
    });

    it('deve lançar 400 se cursoid não for fornecido', () => {
      expect(() => service.create({ descricao: 'Física' })).toThrow(AppError);
      expect(() => service.create({ descricao: 'Física' })).toThrow('Curso é obrigatório');
    });

    it('deve criar categoria com sucesso', async () => {
      mockRepo.create.mockResolvedValue(fakeCategoria(3, 'Química', 2) as never);
      const result = await service.create({ descricao: 'Química', cursoid: 2 });
      expect(result.id).toBe(3);
      expect(result.descricao).toBe('Química');
    });
  });

  // ── update ────────────────────────────────────────────────────────────
  describe('update()', () => {
    it('deve lançar 404 se categoria não existir', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update(99, { descricao: 'X' })).rejects.toMatchObject({ statusCode: 404 });
    });

    it('deve atualizar categoria com sucesso', async () => {
      mockRepo.findById.mockResolvedValue(fakeCategoria() as never);
      mockRepo.update.mockResolvedValue(fakeCategoria(1, 'Geometria') as never);
      const result = await service.update(1, { descricao: 'Geometria' });
      expect(result.descricao).toBe('Geometria');
    });
  });

  // ── delete ────────────────────────────────────────────────────────────
  describe('delete()', () => {
    it('deve lançar 404 se categoria não existir', async () => {
      mockRepo.delete.mockResolvedValue(false);
      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
    });

    it('deve deletar com sucesso e retornar mensagem', async () => {
      mockRepo.delete.mockResolvedValue(true);
      const result = await service.delete(1);
      expect(result.message).toMatch(/removida/i);
    });
  });
});

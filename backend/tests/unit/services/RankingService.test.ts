import { RankingService } from '../../../src/services/RankingService';
import { UsuarioRepository } from '../../../src/repositories/UsuarioRepository';
import { Role } from '../../../src/shared/constants';

// ── Mocks ─────────────────────────────────────────────────────────────────
jest.mock('../../../src/repositories/UsuarioRepository');

const MockUsuarioRepo = UsuarioRepository as jest.MockedClass<typeof UsuarioRepository>;

const fakePlayer = (id: number, pontuacao: number, campusId: number | null = null, cursoId: number | null = null) => ({
  id,
  nome: `Jogador ${id}`,
  foto: null,
  pontuacao,
  campusId,
  cursoId,
  role: Role.PLAYER,
});

// ═══════════════════════════════════════════════════════════════════════════
describe('RankingService', () => {
  let service: RankingService;
  let mockRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    MockUsuarioRepo.mockClear();
    service  = new RankingService({} as never);
    mockRepo = MockUsuarioRepo.mock.instances[0] as jest.Mocked<UsuarioRepository>;
  });

  // ── getGlobalRanking ──────────────────────────────────────────────────
  describe('getGlobalRanking()', () => {
    it('deve retornar ranking com posições corretas', async () => {
      mockRepo.findGlobalRanking.mockResolvedValue([
        fakePlayer(1, 300),
        fakePlayer(2, 200),
        fakePlayer(3, 100),
      ] as never);

      const result = await service.getGlobalRanking();
      expect(result[0].position).toBe(1);
      expect(result[1].position).toBe(2);
      expect(result[2].position).toBe(3);
    });

    it('deve retornar lista vazia se não houver jogadores', async () => {
      mockRepo.findGlobalRanking.mockResolvedValue([]);
      const result = await service.getGlobalRanking();
      expect(result).toEqual([]);
    });

    it('deve repassar o limite correto ao repositório', async () => {
      mockRepo.findGlobalRanking.mockResolvedValue([]);
      await service.getGlobalRanking(10);
      expect(mockRepo.findGlobalRanking).toHaveBeenCalledWith(10);
    });

    it('deve mapear campos corretamente na entrada do ranking', async () => {
      mockRepo.findGlobalRanking.mockResolvedValue([fakePlayer(7, 500, 2, 3)] as never);
      const [entry] = await service.getGlobalRanking();
      expect(entry).toMatchObject({
        position: 1,
        id: 7,
        nome: 'Jogador 7',
        foto: null,
        pontuacao: 500,
        campusId: 2,
        cursoId: 3,
      });
    });
  });

  // ── getRankingByCurso ─────────────────────────────────────────────────
  describe('getRankingByCurso()', () => {
    it('deve filtrar pelo cursoId e retornar ranking', async () => {
      mockRepo.findRankingByCurso.mockResolvedValue([fakePlayer(1, 150, null, 5)] as never);
      const result = await service.getRankingByCurso(5);
      expect(mockRepo.findRankingByCurso).toHaveBeenCalledWith(5, 50);
      expect(result[0].position).toBe(1);
    });

    it('deve retornar lista vazia se o curso não tiver jogadores', async () => {
      mockRepo.findRankingByCurso.mockResolvedValue([]);
      const result = await service.getRankingByCurso(99);
      expect(result).toEqual([]);
    });
  });

  // ── getRankingByCampus ────────────────────────────────────────────────
  describe('getRankingByCampus()', () => {
    it('deve filtrar pelo campusId e retornar ranking', async () => {
      mockRepo.findRankingByCampus.mockResolvedValue([
        fakePlayer(2, 250, 3),
        fakePlayer(5, 180, 3),
      ] as never);

      const result = await service.getRankingByCampus(3);
      expect(mockRepo.findRankingByCampus).toHaveBeenCalledWith(3, 50);
      expect(result).toHaveLength(2);
      expect(result[0].position).toBe(1);
      expect(result[1].position).toBe(2);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  apiRegisterUser,
  apiGetUser,
  apiUpdateUser,
  apiUpdateScore,
  apiGetRanking,
} from './user.service';

const mockCallEdge = vi.fn();
vi.mock('@/lib/api-client', () => ({
  callEdge: (...args: any[]) => mockCallEdge(...args),
}));

function mockResponse(data: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(data) } as Response;
}

const fakeUser = {
  id: 1, nome: 'Clara', email: 'clara@test.com', role: 0,
  pontuacao: 100, foto: '', cursoid: 1, campusid: null,
  cidade: 'SP', uf: 'SP', telefone: '', sexo: 0,
  turma: null, periodo: null, datanascimento: '2000-01-01', status: true,
};

describe('user.service', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('apiRegisterUser', () => {
    it('deve cadastrar usuário com sucesso', async () => {
      mockCallEdge.mockResolvedValue(mockResponse(fakeUser));

      const result = await apiRegisterUser({ nome: 'Clara', email: 'clara@test.com', senha: '123', cursoid: 1 });

      expect(mockCallEdge).toHaveBeenCalledWith('usuarios-api', '', {
        method: 'POST',
        body: { nome: 'Clara', email: 'clara@test.com', senha: '123', cursoid: 1 },
      });
      expect(result.nome).toBe('Clara');
    });

    it('deve lançar erro ao falhar no cadastro', async () => {
      mockCallEdge.mockResolvedValue(mockResponse({ message: 'Email já existe' }, false));
      await expect(
        apiRegisterUser({ nome: 'X', email: 'x@x.com', senha: '1', cursoid: 1 })
      ).rejects.toThrow('Email já existe');
    });
  });

  describe('apiGetUser', () => {
    it('deve retornar usuário por id', async () => {
      mockCallEdge.mockResolvedValue(mockResponse(fakeUser));

      const result = await apiGetUser(1);

      expect(mockCallEdge).toHaveBeenCalledWith('usuarios-api', '1');
      expect(result.id).toBe(1);
    });

    it('deve lançar erro quando usuário não existe', async () => {
      mockCallEdge.mockResolvedValue(mockResponse({}, false));
      await expect(apiGetUser(999)).rejects.toThrow('Erro ao buscar usuário');
    });
  });

  describe('apiUpdateUser', () => {
    it('deve atualizar usuário', async () => {
      const updated = { ...fakeUser, nome: 'Clara Updated' };
      mockCallEdge.mockResolvedValue(mockResponse(updated));

      const result = await apiUpdateUser(1, { nome: 'Clara Updated' });

      expect(mockCallEdge).toHaveBeenCalledWith('usuarios-api', '1', {
        method: 'PUT',
        body: { nome: 'Clara Updated' },
      });
      expect(result.nome).toBe('Clara Updated');
    });
  });

  describe('apiUpdateScore', () => {
    it('deve atualizar pontuação', async () => {
      const updated = { ...fakeUser, pontuacao: 200 };
      mockCallEdge.mockResolvedValue(mockResponse(updated));

      const result = await apiUpdateScore(1, 200);

      expect(mockCallEdge).toHaveBeenCalledWith('usuarios-api', '1/pontuacao', {
        method: 'PUT',
        body: { pontuacao: 200 },
      });
      expect(result.pontuacao).toBe(200);
    });
  });

  describe('apiGetRanking', () => {
    it('deve retornar ranking do curso', async () => {
      const ranking = [
        { id: 1, nome: 'Clara', foto: '', pontuacao: 200 },
        { id: 2, nome: 'Livia', foto: '', pontuacao: 150 },
      ];
      mockCallEdge.mockResolvedValue(mockResponse(ranking));

      const result = await apiGetRanking(1);

      expect(mockCallEdge).toHaveBeenCalledWith('usuarios-api', 'ranking/1');
      expect(result).toHaveLength(2);
      expect(result[0].pontuacao).toBeGreaterThan(result[1].pontuacao);
    });
  });
});

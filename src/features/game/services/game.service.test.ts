import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  apiGetCampusList,
  apiGetCursoList,
  apiGetPerguntasByQuiz,
  apiGetAlternativas,
} from './game.service';

const mockCallEdge = vi.fn();
vi.mock('@/lib/api-client', () => ({
  callEdge: (...args: any[]) => mockCallEdge(...args),
}));

function mockResponse(data: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(data) } as Response;
}

describe('game.service', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('apiGetCampusList', () => {
    it('deve retornar lista de campus', async () => {
      const campusList = [{ id: 1, nomecampus: 'Campus A' }];
      mockCallEdge.mockResolvedValue(mockResponse(campusList));

      const result = await apiGetCampusList();

      expect(mockCallEdge).toHaveBeenCalledWith('campus-api', '');
      expect(result).toEqual(campusList);
    });

    it('deve lançar erro ao falhar', async () => {
      mockCallEdge.mockResolvedValue(mockResponse({}, false));
      await expect(apiGetCampusList()).rejects.toThrow('Erro ao buscar campus');
    });
  });

  describe('apiGetCursoList', () => {
    it('deve retornar lista de cursos', async () => {
      const cursos = [{ id: 1, nome: 'Engenharia', imagem: 'eng.png' }];
      mockCallEdge.mockResolvedValue(mockResponse(cursos));

      const result = await apiGetCursoList();

      expect(mockCallEdge).toHaveBeenCalledWith('curso-api', '');
      expect(result[0].nome).toBe('Engenharia');
    });
  });

  describe('apiGetPerguntasByQuiz', () => {
    it('deve montar path correto apenas com quizId', async () => {
      mockCallEdge.mockResolvedValue(mockResponse([]));

      await apiGetPerguntasByQuiz(5);

      expect(mockCallEdge).toHaveBeenCalledWith('perguntas-api', 'quiz/5');
    });

    it('deve montar path com categoriaId e paginação', async () => {
      mockCallEdge.mockResolvedValue(mockResponse([]));

      await apiGetPerguntasByQuiz(5, 2, undefined, 10, 20);

      expect(mockCallEdge).toHaveBeenCalledWith('perguntas-api', 'quiz/5/categoria/2/10/20');
    });

    it('deve montar path com userId e paginação', async () => {
      mockCallEdge.mockResolvedValue(mockResponse([]));

      await apiGetPerguntasByQuiz(5, 2, 7, 0, 10);

      expect(mockCallEdge).toHaveBeenCalledWith('perguntas-api', 'quiz/5/categoria/2/usuario/7/0/10');
    });

    it('deve lançar erro ao falhar', async () => {
      mockCallEdge.mockResolvedValue(mockResponse({ message: 'Quiz não encontrado' }, false));
      await expect(apiGetPerguntasByQuiz(999)).rejects.toThrow('Quiz não encontrado');
    });
  });

  describe('apiGetAlternativas', () => {
    it('deve retornar alternativas da pergunta', async () => {
      const alts = [
        { id: 1, conteudo: 'Opção A', imagem: null, correta: true, perguntasid: 10 },
        { id: 2, conteudo: 'Opção B', imagem: null, correta: false, perguntasid: 10 },
      ];
      mockCallEdge.mockResolvedValue(mockResponse(alts));

      const result = await apiGetAlternativas(10);

      expect(mockCallEdge).toHaveBeenCalledWith('alternativas-api', 'pergunta/10');
      expect(result).toHaveLength(2);
      expect(result.find(a => a.correta)?.conteudo).toBe('Opção A');
    });
  });
});

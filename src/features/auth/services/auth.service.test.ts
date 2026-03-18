import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiLogin } from './auth.service';

// Mock callEdge
const mockCallEdge = vi.fn();
vi.mock('@/lib/api-client', () => ({
  callEdge: (...args: any[]) => mockCallEdge(...args),
}));

function mockResponse(data: unknown, ok = true, status = 200) {
  return { ok, status, json: () => Promise.resolve(data) } as Response;
}

describe('auth.service', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('apiLogin', () => {
    it('deve retornar token, id e role com credenciais válidas', async () => {
      const payload = { token: 'abc123', id: 1, role: 0 };
      mockCallEdge.mockResolvedValue(mockResponse(payload));

      const result = await apiLogin('user@test.com', 'senha123');

      expect(mockCallEdge).toHaveBeenCalledWith('auth-api', '', {
        method: 'POST',
        body: { email: 'user@test.com', senha: 'senha123' },
      });
      expect(result).toEqual(payload);
    });

    it('deve lançar erro quando credenciais são inválidas', async () => {
      mockCallEdge.mockResolvedValue(
        mockResponse({ message: 'Email e/ou Senha Incorretos' }, false, 401)
      );

      await expect(apiLogin('bad@test.com', 'wrong')).rejects.toThrow('Email e/ou Senha Incorretos');
    });

    it('deve usar mensagem padrão quando backend não retorna message', async () => {
      mockCallEdge.mockResolvedValue(mockResponse({}, false, 500));

      await expect(apiLogin('a@b.com', 'x')).rejects.toThrow('Erro ao fazer login');
    });
  });
});

import * as service from '@/models/services/usuario.service';
import type { UsuarioPublico, UsuarioCreate, UsuarioUpdate, RankingEntry } from '@/models/types';

export class UsuarioController {
  async getById(id: number): Promise<UsuarioPublico> {
    if (!id || id <= 0) throw new Error('ID de usuário inválido');
    return service.getUsuarioById(id);
  }

  async create(data: UsuarioCreate): Promise<UsuarioPublico> {
    if (!data.nome?.trim()) throw new Error('Nome é obrigatório');
    if (!data.email?.trim()) throw new Error('Email é obrigatório');
    if (!data.senha || data.senha.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres');
    if (!data.cursoid) throw new Error('Curso é obrigatório');

    return service.createUsuario({
      ...data,
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
    });
  }

  async update(id: number, updates: UsuarioUpdate): Promise<UsuarioPublico> {
    if (!id || id <= 0) throw new Error('ID de usuário inválido');
    return service.updateUsuario(id, updates);
  }

  async updateScore(id: number, pontuacao: number): Promise<UsuarioPublico> {
    if (!id || id <= 0) throw new Error('ID de usuário inválido');
    if (pontuacao < 0) throw new Error('Pontuação não pode ser negativa');
    return service.updatePontuacao(id, pontuacao);
  }

  async getRanking(cursoId: number): Promise<RankingEntry[]> {
    if (!cursoId || cursoId <= 0) throw new Error('ID do curso inválido');
    return service.getRanking(cursoId);
  }
}

import * as service from '@/models/services/usuario.service';
import { Usuario } from '@/entities';
import type { UsuarioCreate, UsuarioUpdate, RankingEntry } from '@/models/types';

export class UsuarioController {
  async getById(id: number): Promise<Usuario> {
    if (!id || id <= 0) throw new Error('ID de usuário inválido');
    const data = await service.getUsuarioById(id);
    return Usuario.fromApi(data);
  }

  async create(data: UsuarioCreate): Promise<Usuario> {
    if (!data.nome?.trim()) throw new Error('Nome é obrigatório');
    if (!data.email?.trim()) throw new Error('Email é obrigatório');
    if (!data.senha || data.senha.length < 6) throw new Error('Senha deve ter pelo menos 6 caracteres');
    if (!data.cursoid) throw new Error('Curso é obrigatório');

    const result = await service.createUsuario({
      ...data,
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
    });
    return Usuario.fromApi(result);
  }

  async update(id: number, updates: UsuarioUpdate): Promise<Usuario> {
    if (!id || id <= 0) throw new Error('ID de usuário inválido');
    const data = await service.updateUsuario(id, updates);
    return Usuario.fromApi(data);
  }

  async updateScore(id: number, pontuacao: number): Promise<Usuario> {
    if (!id || id <= 0) throw new Error('ID de usuário inválido');
    if (pontuacao < 0) throw new Error('Pontuação não pode ser negativa');
    const data = await service.updatePontuacao(id, pontuacao);
    return Usuario.fromApi(data);
  }

  async getRanking(cursoId: number): Promise<RankingEntry[]> {
    if (!cursoId || cursoId <= 0) throw new Error('ID do curso inválido');
    return service.getRanking(cursoId);
  }
}

import { DataSource } from 'typeorm';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { Usuario } from '../entities/Usuario';

export interface RankingEntry {
  position: number;
  id: number;
  nome: string;
  foto: string | null;
  pontuacao: number;
  campusId: number | null;
  cursoId: number | null;
}

function toRankingEntry(u: Usuario, index: number): RankingEntry {
  return {
    position: index + 1,
    id:       u.id,
    nome:     u.nome,
    foto:     u.foto,
    pontuacao: u.pontuacao,
    campusId: u.campusId,
    cursoId:  u.cursoId,
  };
}

export class RankingService {
  private usuarioRepo: UsuarioRepository;

  constructor(dataSource: DataSource) {
    this.usuarioRepo = new UsuarioRepository(dataSource);
  }

  async getGlobalRanking(limit = 100): Promise<RankingEntry[]> {
    const users = await this.usuarioRepo.findGlobalRanking(limit);
    return users.map(toRankingEntry);
  }

  async getRankingByCurso(cursoId: number, limit = 50): Promise<RankingEntry[]> {
    const users = await this.usuarioRepo.findRankingByCurso(cursoId, limit);
    return users.map(toRankingEntry);
  }

  async getRankingByCampus(campusId: number, limit = 50): Promise<RankingEntry[]> {
    const users = await this.usuarioRepo.findRankingByCampus(campusId, limit);
    return users.map(toRankingEntry);
  }
}

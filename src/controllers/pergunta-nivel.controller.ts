import * as service from '@/models/services/pergunta-nivel.service';
import type { PerguntaNivel, PerguntaNivelCreate, PerguntaNivelUpdate } from '@/models/types';

export class PerguntaNivelController {
  async getAll(): Promise<PerguntaNivel[]> {
    return service.getPerguntaNivelList();
  }

  async getById(id: number): Promise<PerguntaNivel> {
    if (!id || id <= 0) throw new Error('ID do nível inválido');
    return service.getPerguntaNivelById(id);
  }

  async create(data: PerguntaNivelCreate): Promise<PerguntaNivel> {
    if (!data.nivel || data.nivel <= 0) throw new Error('Nível deve ser positivo');
    if (!data.pontuacao || data.pontuacao <= 0) throw new Error('Pontuação deve ser positiva');
    if (!data.tempo || data.tempo <= 0) throw new Error('Tempo deve ser positivo');
    return service.createPerguntaNivel(data);
  }

  async update(id: number, updates: PerguntaNivelUpdate): Promise<PerguntaNivel> {
    if (!id || id <= 0) throw new Error('ID do nível inválido');
    return service.updatePerguntaNivel(id, updates);
  }
}

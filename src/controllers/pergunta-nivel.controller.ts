import * as service from '@/models/services/pergunta-nivel.service';
import { PerguntaNivel } from '@/entities';
import type { PerguntaNivelCreate, PerguntaNivelUpdate } from '@/models/types';

export class PerguntaNivelController {
  async getAll(): Promise<PerguntaNivel[]> {
    const data = await service.getPerguntaNivelList();
    return PerguntaNivel.fromApiList(data);
  }

  async getById(id: number): Promise<PerguntaNivel> {
    if (!id || id <= 0) throw new Error('ID do nível inválido');
    const data = await service.getPerguntaNivelById(id);
    return PerguntaNivel.fromApi(data);
  }

  async create(payload: PerguntaNivelCreate): Promise<PerguntaNivel> {
    if (!payload.nivel || payload.nivel <= 0) throw new Error('Nível deve ser positivo');
    if (!payload.pontuacao || payload.pontuacao <= 0) throw new Error('Pontuação deve ser positiva');
    if (!payload.tempo || payload.tempo <= 0) throw new Error('Tempo deve ser positivo');
    const data = await service.createPerguntaNivel(payload);
    return PerguntaNivel.fromApi(data);
  }

  async update(id: number, updates: PerguntaNivelUpdate): Promise<PerguntaNivel> {
    if (!id || id <= 0) throw new Error('ID do nível inválido');
    const data = await service.updatePerguntaNivel(id, updates);
    return PerguntaNivel.fromApi(data);
  }
}

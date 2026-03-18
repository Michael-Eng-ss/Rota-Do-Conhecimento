import * as service from '@/models/services/alternativa.service';
import { Alternativa } from '@/entities';
import type { AlternativaCreate, AlternativaUpdate } from '@/models/types';

export class AlternativaController {
  async getByPergunta(perguntaId: number): Promise<Alternativa[]> {
    if (!perguntaId || perguntaId <= 0) throw new Error('ID da pergunta inválido');
    const data = await service.getAlternativasByPergunta(perguntaId);
    return Alternativa.fromApiList(data);
  }

  async create(payload: AlternativaCreate): Promise<Alternativa> {
    if (!payload.conteudo?.trim()) throw new Error('Conteúdo da alternativa é obrigatório');
    if (!payload.perguntasid) throw new Error('Pergunta é obrigatória');
    const data = await service.createAlternativa({ ...payload, conteudo: payload.conteudo.trim() });
    return Alternativa.fromApi(data);
  }

  async update(id: number, updates: AlternativaUpdate): Promise<Alternativa> {
    if (!id || id <= 0) throw new Error('ID da alternativa inválido');
    const data = await service.updateAlternativa(id, updates);
    return Alternativa.fromApi(data);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID da alternativa inválido');
    return service.deleteAlternativa(id);
  }
}

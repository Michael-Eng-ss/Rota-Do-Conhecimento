import * as service from '@/models/services/alternativa.service';
import type { Alternativa, AlternativaCreate, AlternativaUpdate } from '@/models/types';

export class AlternativaController {
  async getByPergunta(perguntaId: number): Promise<Alternativa[]> {
    if (!perguntaId || perguntaId <= 0) throw new Error('ID da pergunta inválido');
    return service.getAlternativasByPergunta(perguntaId);
  }

  async create(data: AlternativaCreate): Promise<Alternativa> {
    if (!data.conteudo?.trim()) throw new Error('Conteúdo da alternativa é obrigatório');
    if (!data.perguntasid) throw new Error('Pergunta é obrigatória');
    return service.createAlternativa({ ...data, conteudo: data.conteudo.trim() });
  }

  async update(id: number, updates: AlternativaUpdate): Promise<Alternativa> {
    if (!id || id <= 0) throw new Error('ID da alternativa inválido');
    return service.updateAlternativa(id, updates);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID da alternativa inválido');
    return service.deleteAlternativa(id);
  }
}

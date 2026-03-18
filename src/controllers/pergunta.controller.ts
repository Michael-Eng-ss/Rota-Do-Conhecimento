import * as service from '@/models/services/pergunta.service';
import { Pergunta } from '@/entities';
import type { PerguntaCreate, PerguntaUpdate } from '@/models/types';

export class PerguntaController {
  async getByQuiz(quizId: number, categoriaId?: number, userId?: number, skip = 0, take = 20): Promise<Pergunta[]> {
    if (!quizId || quizId <= 0) throw new Error('ID do quiz inválido');
    const data = await service.getPerguntasByQuiz(quizId, categoriaId, userId, skip, take);
    return Pergunta.fromApiList(data);
  }

  async getById(id: number): Promise<Pergunta> {
    if (!id || id <= 0) throw new Error('ID da pergunta inválido');
    const data = await service.getPerguntaById(id);
    return Pergunta.fromApi(data);
  }

  async create(payload: PerguntaCreate): Promise<Pergunta> {
    if (!payload.conteudo?.trim()) throw new Error('Conteúdo da pergunta é obrigatório');
    if (!payload.perguntasnivelid) throw new Error('Nível é obrigatório');
    if (!payload.categoriasid) throw new Error('Categoria é obrigatória');
    const data = await service.createPergunta({ ...payload, conteudo: payload.conteudo.trim() });
    return Pergunta.fromApi(data);
  }

  async update(id: number, updates: PerguntaUpdate): Promise<Pergunta> {
    if (!id || id <= 0) throw new Error('ID da pergunta inválido');
    const data = await service.updatePergunta(id, updates);
    return Pergunta.fromApi(data);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID da pergunta inválido');
    return service.deletePergunta(id);
  }
}

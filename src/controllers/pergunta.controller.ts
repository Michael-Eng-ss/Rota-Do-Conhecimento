import * as service from '@/models/services/pergunta.service';
import type { Pergunta, PerguntaCreate, PerguntaUpdate } from '@/models/types';

export class PerguntaController {
  async getByQuiz(quizId: number, categoriaId?: number, userId?: number, skip = 0, take = 20): Promise<Pergunta[]> {
    if (!quizId || quizId <= 0) throw new Error('ID do quiz inválido');
    return service.getPerguntasByQuiz(quizId, categoriaId, userId, skip, take);
  }

  async getById(id: number): Promise<Pergunta> {
    if (!id || id <= 0) throw new Error('ID da pergunta inválido');
    return service.getPerguntaById(id);
  }

  async create(data: PerguntaCreate): Promise<Pergunta> {
    if (!data.conteudo?.trim()) throw new Error('Conteúdo da pergunta é obrigatório');
    if (!data.perguntasnivelid) throw new Error('Nível é obrigatório');
    if (!data.categoriasid) throw new Error('Categoria é obrigatória');
    return service.createPergunta({ ...data, conteudo: data.conteudo.trim() });
  }

  async update(id: number, updates: PerguntaUpdate): Promise<Pergunta> {
    if (!id || id <= 0) throw new Error('ID da pergunta inválido');
    return service.updatePergunta(id, updates);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID da pergunta inválido');
    return service.deletePergunta(id);
  }
}

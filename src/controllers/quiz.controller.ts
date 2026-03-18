import * as service from '@/models/services/quiz.service';
import { Quiz } from '@/entities';
import type { QuizCreate, QuizUpdate } from '@/models/types';

export class QuizController {
  async getAll(): Promise<Quiz[]> {
    const data = await service.getQuizList();
    return Quiz.fromApiList(data);
  }

  async getById(id: number): Promise<Quiz> {
    if (!id || id <= 0) throw new Error('ID do quiz inválido');
    const data = await service.getQuizById(id);
    return Quiz.fromApi(data);
  }

  async create(payload: QuizCreate): Promise<Quiz> {
    if (!payload.titulo?.trim()) throw new Error('Título é obrigatório');
    if (!payload.cursoid) throw new Error('Curso é obrigatório');
    if (!payload.usuarioid) throw new Error('Usuário é obrigatório');
    const data = await service.createQuiz({ ...payload, titulo: payload.titulo.trim() });
    return Quiz.fromApi(data);
  }

  async update(id: number, updates: QuizUpdate): Promise<Quiz> {
    if (!id || id <= 0) throw new Error('ID do quiz inválido');
    const data = await service.updateQuiz(id, updates);
    return Quiz.fromApi(data);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID do quiz inválido');
    return service.deleteQuiz(id);
  }
}

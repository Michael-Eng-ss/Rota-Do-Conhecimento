import * as service from '@/models/services/quiz.service';
import type { Quiz, QuizCreate, QuizUpdate } from '@/models/types';

export class QuizController {
  async getAll(): Promise<Quiz[]> {
    return service.getQuizList();
  }

  async getById(id: number): Promise<Quiz> {
    if (!id || id <= 0) throw new Error('ID do quiz inválido');
    return service.getQuizById(id);
  }

  async create(data: QuizCreate): Promise<Quiz> {
    if (!data.titulo?.trim()) throw new Error('Título é obrigatório');
    if (!data.cursoid) throw new Error('Curso é obrigatório');
    if (!data.usuarioid) throw new Error('Usuário é obrigatório');
    return service.createQuiz({ ...data, titulo: data.titulo.trim() });
  }

  async update(id: number, updates: QuizUpdate): Promise<Quiz> {
    if (!id || id <= 0) throw new Error('ID do quiz inválido');
    return service.updateQuiz(id, updates);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID do quiz inválido');
    return service.deleteQuiz(id);
  }
}

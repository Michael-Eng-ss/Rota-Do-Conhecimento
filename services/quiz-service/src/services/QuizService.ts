import { DataSource } from 'typeorm';
import { QuizRepository } from '../repositories/QuizRepository';
import { AppError } from '../shared/AppError';
import { Quiz } from '../entities/Quiz';

export class QuizService {
  private repo: QuizRepository;

  constructor(dataSource: DataSource) {
    this.repo = new QuizRepository(dataSource);
  }

  getAll(): Promise<Quiz[]> {
    return this.repo.findAll();
  }

  getByCurso(cursoid: number): Promise<Quiz[]> {
    return this.repo.findByCurso(cursoid);
  }

  async getById(id: number): Promise<Quiz> {
    const q = await this.repo.findById(id);
    if (!q) throw AppError.notFound('Quiz não encontrado');
    return q;
  }

  create(data: Partial<Quiz>): Promise<Quiz> {
    if (!data.titulo?.trim()) throw AppError.badRequest('Título do quiz é obrigatório');
    if (!data.cursoid)        throw AppError.badRequest('Curso é obrigatório');
    if (!data.usuarioid)      throw AppError.badRequest('Usuário criador é obrigatório');
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<Quiz>): Promise<Quiz> {
    await this.getById(id);
    const updated = await this.repo.update(id, data);
    if (!updated) throw AppError.notFound('Quiz não encontrado');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Quiz não encontrado');
    return { message: 'Quiz removido com sucesso' };
  }
}

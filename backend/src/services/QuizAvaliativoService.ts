import { DataSource } from 'typeorm';
import { QuizAvaliativoRepository } from '../repositories/QuizAvaliativoRepository';
import { AppError } from '../shared/AppError';
import { QuizAvalativoUsuario } from '../entities/QuizAvalativoUsuario';

export class QuizAvaliativoService {
  private repo: QuizAvaliativoRepository;

  constructor(dataSource: DataSource) {
    this.repo = new QuizAvaliativoRepository(dataSource);
  }

  getByUsuario(usuarioid: number): Promise<QuizAvalativoUsuario[]> {
    return this.repo.findByUsuario(usuarioid);
  }

  getByQuiz(quizid: number): Promise<QuizAvalativoUsuario[]> {
    return this.repo.findByQuiz(quizid);
  }

  async getById(id: number): Promise<QuizAvalativoUsuario> {
    const r = await this.repo.findById(id);
    if (!r) throw AppError.notFound('Resultado não encontrado');
    return r;
  }

  create(data: Partial<QuizAvalativoUsuario>): Promise<QuizAvalativoUsuario> {
    if (!data.quizid)    throw AppError.badRequest('ID do quiz é obrigatório');
    if (!data.usuarioid) throw AppError.badRequest('ID do usuário é obrigatório');
    return this.repo.create(data);
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Resultado não encontrado');
    return { message: 'Resultado removido com sucesso' };
  }
}

import { DataSource } from 'typeorm';
import { AlternativaRepository } from '../repositories/AlternativaRepository';
import { AppError } from '../shared/AppError';
import { Alternativa } from '../entities/Alternativa';

export class AlternativaService {
  private repo: AlternativaRepository;

  constructor(dataSource: DataSource) {
    this.repo = new AlternativaRepository(dataSource);
  }

  getByPergunta(perguntasid: number): Promise<Alternativa[]> {
    return this.repo.findByPergunta(perguntasid);
  }

  async getById(id: number): Promise<Alternativa> {
    const a = await this.repo.findById(id);
    if (!a) throw AppError.notFound('Alternativa não encontrada');
    return a;
  }

  create(data: Partial<Alternativa>): Promise<Alternativa> {
    if (!data.perguntasid) throw AppError.badRequest('ID da pergunta é obrigatório');
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<Alternativa>): Promise<Alternativa> {
    await this.getById(id);
    const updated = await this.repo.update(id, data);
    if (!updated) throw AppError.notFound('Alternativa não encontrada');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Alternativa não encontrada');
    return { message: 'Alternativa removida com sucesso' };
  }
}

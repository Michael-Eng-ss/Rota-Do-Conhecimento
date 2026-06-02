import { DataSource } from 'typeorm';
import { CursoRepository } from '../repositories/CursoRepository';
import { AppError } from '../shared/AppError';
import { Curso } from '../entities/Curso';

export class CursoService {
  private repo: CursoRepository;

  constructor(dataSource: DataSource) {
    this.repo = new CursoRepository(dataSource);
  }

  getAll(): Promise<Curso[]> {
    return this.repo.findAll();
  }

  async getById(id: number): Promise<Curso> {
    const c = await this.repo.findById(id);
    if (!c) throw AppError.notFound('Curso não encontrado');
    return c;
  }

  create(data: Partial<Curso>): Promise<Curso> {
    if (!data.nome?.trim()) throw AppError.badRequest('Nome do curso é obrigatório');
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<Curso>): Promise<Curso> {
    await this.getById(id);
    const updated = await this.repo.update(id, data);
    if (!updated) throw AppError.notFound('Curso não encontrado');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Curso não encontrado');
    return { message: 'Curso removido com sucesso' };
  }
}

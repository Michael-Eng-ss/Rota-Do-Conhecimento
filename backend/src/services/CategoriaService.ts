import { DataSource } from 'typeorm';
import { CategoriaRepository } from '../repositories/CategoriaRepository';
import { AppError } from '../shared/AppError';
import { Categoria } from '../entities/Categoria';

export class CategoriaService {
  private repo: CategoriaRepository;

  constructor(dataSource: DataSource) {
    this.repo = new CategoriaRepository(dataSource);
  }

  getAll(): Promise<Categoria[]> {
    return this.repo.findAll();
  }

  getByCurso(cursoid: number): Promise<Categoria[]> {
    return this.repo.findByCurso(cursoid);
  }

  async getById(id: number): Promise<Categoria> {
    const c = await this.repo.findById(id);
    if (!c) throw AppError.notFound('Categoria não encontrada');
    return c;
  }

  create(data: Partial<Categoria>): Promise<Categoria> {
    if (!data.descricao?.trim()) throw AppError.badRequest('Descrição da categoria é obrigatória');
    if (!data.cursoid)           throw AppError.badRequest('Curso é obrigatório');
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<Categoria>): Promise<Categoria> {
    await this.getById(id);
    const updated = await this.repo.update(id, data);
    if (!updated) throw AppError.notFound('Categoria não encontrada');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Categoria não encontrada');
    return { message: 'Categoria removida com sucesso' };
  }
}

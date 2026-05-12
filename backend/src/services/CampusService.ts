import { DataSource } from 'typeorm';
import { CampusRepository } from '../repositories/CampusRepository';
import { AppError } from '../shared/AppError';
import { Campus } from '../entities/Campus';

export class CampusService {
  private campusRepo: CampusRepository;

  constructor(dataSource: DataSource) {
    this.campusRepo = new CampusRepository(dataSource);
  }

  async getAll(): Promise<Campus[]> {
    return this.campusRepo.findAll();
  }

  async getById(id: number): Promise<Campus> {
    const campus = await this.campusRepo.findById(id);
    if (!campus) throw AppError.notFound('Campus não encontrado');
    return campus;
  }

  async create(nome: string): Promise<Campus> {
    if (await this.campusRepo.existsByName(nome)) {
      throw AppError.conflict('Campus já cadastrado com este nome');
    }
    return this.campusRepo.create(nome);
  }

  async update(id: number, nome: string): Promise<Campus> {
    const existing = await this.campusRepo.findById(id);
    if (!existing) throw AppError.notFound('Campus não encontrado');
    const updated = await this.campusRepo.update(id, nome);
    if (!updated) throw AppError.notFound('Campus não encontrado');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.campusRepo.delete(id);
    if (!ok) throw AppError.notFound('Campus não encontrado');
    return { message: 'Campus removido com sucesso' };
  }
}

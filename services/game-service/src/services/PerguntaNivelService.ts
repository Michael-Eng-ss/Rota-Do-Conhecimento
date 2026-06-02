import { DataSource } from 'typeorm';
import { PerguntaNivelRepository } from '../repositories/PerguntaNivelRepository';
import { AppError } from '../shared/AppError';
import { PerguntaNivel } from '../entities/PerguntaNivel';

export class PerguntaNivelService {
  private repo: PerguntaNivelRepository;

  constructor(dataSource: DataSource) {
    this.repo = new PerguntaNivelRepository(dataSource);
  }

  getAll(): Promise<PerguntaNivel[]> {
    return this.repo.findAll();
  }

  async getById(id: number): Promise<PerguntaNivel> {
    const n = await this.repo.findById(id);
    if (!n) throw AppError.notFound('Nível não encontrado');
    return n;
  }

  create(data: Partial<PerguntaNivel>): Promise<PerguntaNivel> {
    if (data.nivel === undefined) throw AppError.badRequest('Nível é obrigatório');
    if (data.pontuacao === undefined) throw AppError.badRequest('Pontuação é obrigatória');
    if (data.tempo === undefined) throw AppError.badRequest('Tempo é obrigatório');
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<PerguntaNivel>): Promise<PerguntaNivel> {
    await this.getById(id);
    const updated = await this.repo.update(id, data);
    if (!updated) throw AppError.notFound('Nível não encontrado');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Nível não encontrado');
    return { message: 'Nível removido com sucesso' };
  }
}

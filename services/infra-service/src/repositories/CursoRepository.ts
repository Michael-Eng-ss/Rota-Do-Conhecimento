import { Repository, DataSource } from 'typeorm';
import { Curso } from '../entities/Curso';

export class CursoRepository {
  private repo: Repository<Curso>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Curso);
  }

  findAll(): Promise<Curso[]> {
    return this.repo.find({ order: { nome: 'ASC' } });
  }

  findById(id: number): Promise<Curso | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Curso>): Promise<Curso> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Curso>): Promise<Curso | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

import { Repository, DataSource } from 'typeorm';
import { Categoria } from '../entities/Categoria';

export class CategoriaRepository {
  private repo: Repository<Categoria>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Categoria);
  }

  findAll(): Promise<Categoria[]> {
    return this.repo.find({ order: { descricao: 'ASC' } });
  }

  findByCurso(cursoid: number): Promise<Categoria[]> {
    return this.repo.find({ where: { cursoid }, order: { descricao: 'ASC' } });
  }

  findById(id: number): Promise<Categoria | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Categoria>): Promise<Categoria> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Categoria>): Promise<Categoria | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

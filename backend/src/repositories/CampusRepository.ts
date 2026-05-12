import { Repository, DataSource } from 'typeorm';
import { Campus } from '../entities/Campus';

export class CampusRepository {
  private repo: Repository<Campus>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Campus);
  }

  async findAll(): Promise<Campus[]> {
    return this.repo.find({ order: { nome: 'ASC' } });
  }

  async findById(id: number): Promise<Campus | null> {
    return this.repo.findOneBy({ id });
  }

  async create(nome: string): Promise<Campus> {
    const entity = this.repo.create({ nome });
    return this.repo.save(entity);
  }

  async update(id: number, nome: string): Promise<Campus | null> {
    await this.repo.update(id, { nome });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async existsByName(nome: string): Promise<boolean> {
    return (await this.repo.count({ where: { nome } })) > 0;
  }
}

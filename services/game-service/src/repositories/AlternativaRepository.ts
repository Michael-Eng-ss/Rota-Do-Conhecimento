import { Repository, DataSource } from 'typeorm';
import { Alternativa } from '../entities/Alternativa';

export class AlternativaRepository {
  private repo: Repository<Alternativa>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Alternativa);
  }

  findByPergunta(perguntasid: number): Promise<Alternativa[]> {
    return this.repo.find({ where: { perguntasid }, order: { id: 'ASC' } });
  }

  findById(id: number): Promise<Alternativa | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Alternativa>): Promise<Alternativa> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Alternativa>): Promise<Alternativa | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

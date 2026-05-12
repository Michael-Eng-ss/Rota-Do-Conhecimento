import { Repository, DataSource } from 'typeorm';
import { PerguntaNivel } from '../entities/PerguntaNivel';

export class PerguntaNivelRepository {
  private repo: Repository<PerguntaNivel>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(PerguntaNivel);
  }

  findAll(): Promise<PerguntaNivel[]> {
    return this.repo.find({ order: { nivel: 'ASC' } });
  }

  findById(id: number): Promise<PerguntaNivel | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<PerguntaNivel>): Promise<PerguntaNivel> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<PerguntaNivel>): Promise<PerguntaNivel | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

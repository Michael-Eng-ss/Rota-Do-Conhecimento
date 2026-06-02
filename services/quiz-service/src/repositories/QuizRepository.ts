import { Repository, DataSource } from 'typeorm';
import { Quiz } from '../entities/Quiz';

export class QuizRepository {
  private repo: Repository<Quiz>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Quiz);
  }

  findAll(): Promise<Quiz[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findById(id: number): Promise<Quiz | null> {
    return this.repo.findOneBy({ id });
  }

  findByCurso(cursoid: number): Promise<Quiz[]> {
    return this.repo.find({ where: { cursoid }, order: { id: 'ASC' } });
  }

  create(data: Partial<Quiz>): Promise<Quiz> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Quiz>): Promise<Quiz | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

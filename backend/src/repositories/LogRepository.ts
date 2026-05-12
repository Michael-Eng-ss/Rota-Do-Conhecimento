import { Repository, DataSource } from 'typeorm';
import { Log } from '../entities/Log';

export class LogRepository {
  private repo: Repository<Log>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Log);
  }

  async create(usuariosId: number, acao: string): Promise<Log> {
    const entity = this.repo.create({ usuariosId, acao });
    return this.repo.save(entity);
  }

  async findByDateRange(start: Date, end: Date): Promise<Log[]> {
    return this.repo
      .createQueryBuilder('log')
      .where('log.dataLogin BETWEEN :start AND :end', { start, end })
      .orderBy('log.dataLogin', 'DESC')
      .getMany();
  }

  async findByUser(usuariosId: number, limit = 50): Promise<Log[]> {
    return this.repo.find({
      where: { usuariosId },
      order: { dataLogin: 'DESC' },
      take: limit,
    });
  }
}

import { Repository, DataSource } from 'typeorm';
import { Progresso } from '../entities/Progresso';

export class ProgressoRepository {
  private repo: Repository<Progresso>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Progresso);
  }

  findByUsuario(usuariosid: number): Promise<Progresso[]> {
    return this.repo.find({ where: { usuariosid }, order: { id: 'ASC' } });
  }

  findByQuizAndUsuario(perguntasids: number[], usuariosid: number): Promise<Progresso[]> {
    return this.repo
      .createQueryBuilder('pp')
      .where('pp.usuariosid = :usuariosid', { usuariosid })
      .andWhere('pp.perguntasid IN (:...ids)', { ids: perguntasids })
      .getMany();
  }

  findById(id: number): Promise<Progresso | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Progresso>): Promise<Progresso> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

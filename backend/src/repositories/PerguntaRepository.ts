import { Repository, DataSource } from 'typeorm';
import { Pergunta } from '../entities/Pergunta';

export class PerguntaRepository {
  private repo: Repository<Pergunta>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Pergunta);
  }

  findAll(): Promise<Pergunta[]> {
    return this.repo.find({ 
      relations: ['alternativas', 'nivel'],
      order: { id: 'ASC' } 
    });
  }

  findById(id: number): Promise<Pergunta | null> {
    return this.repo.findOneBy({ id });
  }

  /** Retorna perguntas de uma categoria com alternativas (join completo). */
  findCompletasByCategoria(categoriasid: number, activeOnly: boolean): Promise<Pergunta[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.alternativas', 'a')
      .leftJoinAndSelect('p.nivel', 'n')
      .where('p.categoriasid = :categoriasid', { categoriasid });

    if (activeOnly) qb.andWhere('p.status = true');

    // Aleatorizar na camada de banco
    qb.orderBy('RANDOM()');

    return qb.getMany();
  }

  create(data: Partial<Pergunta>): Promise<Pergunta> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Pergunta>): Promise<Pergunta | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

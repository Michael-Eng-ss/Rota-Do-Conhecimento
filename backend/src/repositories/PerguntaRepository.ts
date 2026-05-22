import { Repository, DataSource } from 'typeorm';
import { Pergunta } from '../entities/Pergunta';

export class PerguntaRepository {
  private repo: Repository<Pergunta>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Pergunta);
  }

  findAll(): Promise<Pergunta[]> {
    return this.repo.find({ 
      relations: ['alternativas', 'nivel', 'categoria', 'categoria.curso'],
      order: { id: 'ASC' } 
    });
  }

  findById(id: number): Promise<Pergunta | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['alternativas', 'nivel', 'categoria', 'categoria.curso'],
    });
  }

  /** Retorna perguntas de uma categoria com alternativas (join completo). */
  findCompletasByCategoria(categoriasid: number, activeOnly: boolean): Promise<Pergunta[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.alternativas', 'a')
      .leftJoinAndSelect('p.nivel', 'n')
      .leftJoinAndSelect('p.categoria', 'cat')
      .leftJoinAndSelect('cat.curso', 'curso')
      .where('p.categoriasid = :categoriasid', { categoriasid });

    if (activeOnly) qb.andWhere('p.status = true');

    // Aleatorizar na camada de banco
    qb.orderBy('RANDOM()');

    return qb.getMany();
  }

  /** Retorna perguntas filtradas por nível de dificuldade. */
  findByNivel(nivelId: number, activeOnly = true): Promise<Pergunta[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.alternativas', 'a')
      .leftJoinAndSelect('p.nivel', 'n')
      .leftJoinAndSelect('p.categoria', 'cat')
      .where('p.perguntasnivelid = :nivelId', { nivelId });

    if (activeOnly) qb.andWhere('p.status = true');
    qb.orderBy('p.id', 'ASC');

    return qb.getMany();
  }

  /** Retorna perguntas filtradas por campus (via categoria → curso → campus). */
  findByCampus(campusId: number, activeOnly = true): Promise<Pergunta[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.alternativas', 'a')
      .leftJoinAndSelect('p.nivel', 'n')
      .leftJoinAndSelect('p.categoria', 'cat')
      .leftJoinAndSelect('cat.curso', 'curso')
      .leftJoin('usuarios', 'u', 'u.cursoid = curso.id')
      .where('u.campusid = :campusId', { campusId });

    if (activeOnly) qb.andWhere('p.status = true');
    qb.orderBy('p.id', 'ASC');

    return qb.getMany();
  }

  /** Retorna perguntas que possuem imagem (pathimage não nulo). */
  findWithImage(activeOnly = true): Promise<Pergunta[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.alternativas', 'a')
      .leftJoinAndSelect('p.nivel', 'n')
      .leftJoinAndSelect('p.categoria', 'cat')
      .where('p.pathimage IS NOT NULL')
      .andWhere("p.pathimage != ''");

    if (activeOnly) qb.andWhere('p.status = true');
    qb.orderBy('p.id', 'ASC');

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


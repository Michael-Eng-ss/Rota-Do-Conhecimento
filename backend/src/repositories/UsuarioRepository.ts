import { Repository, DataSource, DeepPartial } from 'typeorm';
import { Usuario } from '../entities/Usuario';
import { Role } from '../shared/constants';

export class UsuarioRepository {
  private repo: Repository<Usuario>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Usuario);
  }

  // ── Leitura ───────────────────────────────────────────────────────────────

  /** Busca por e-mail, incluindo a senha (select: false). */
  async findByEmailWithPassword(email: string): Promise<Usuario | null> {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.senha')
      .where('u.email = :email', { email })
      .getOne();
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.repo.findOneBy({ id });
  }

  async findByIdWithRelations(id: number): Promise<Usuario | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['campus', 'curso'],
    });
  }

  async findByCampus(campusId: number): Promise<Usuario[]> {
    return this.repo.find({ where: { campusId, status: true } });
  }

  async findByCurso(
    cursoId: number,
    skip = 0,
    take = 20,
  ): Promise<Usuario[]> {
    return this.repo.find({
      where: { cursoId, status: true },
      skip,
      take,
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.repo.find({ where: { status: true } });
  }

  /** Lista TODOS os usuários (incluindo inativos) — apenas para admin. */
  async findAllForAdmin(): Promise<Usuario[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  /** Ativa ou desativa um usuário. */
  async setStatus(id: number, status: boolean): Promise<boolean> {
    const result = await this.repo.update(id, { status });
    return (result.affected ?? 0) > 0;
  }

  // ── Ranking ───────────────────────────────────────────────────────────────

  async findRankingByCurso(cursoId: number, limit = 50): Promise<Usuario[]> {
    return this.repo.find({
      where: { cursoId, status: true },
      select: ['id', 'nome', 'foto', 'pontuacao', 'campusId', 'cursoId'],
      order: { pontuacao: 'DESC' },
      take: limit,
    });
  }

  async findRankingByCampus(campusId: number, limit = 50): Promise<Usuario[]> {
    return this.repo.find({
      where: { campusId, status: true },
      select: ['id', 'nome', 'foto', 'pontuacao', 'campusId', 'cursoId'],
      order: { pontuacao: 'DESC' },
      take: limit,
    });
  }

  async findGlobalRanking(limit = 100): Promise<Usuario[]> {
    return this.repo.find({
      where: { status: true },
      select: ['id', 'nome', 'foto', 'pontuacao', 'campusId', 'cursoId'],
      order: { pontuacao: 'DESC' },
      take: limit,
    });
  }

  // ── Escrita ───────────────────────────────────────────────────────────────

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: DeepPartial<Usuario>): Promise<Usuario | null> {
    await this.repo.update(id, data as object);
    return this.findById(id);
  }

  async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    const result = await this.repo.update(id, { senha: hashedPassword });
    return (result.affected ?? 0) > 0;
  }

  async updateScore(id: number, delta: number): Promise<Usuario | null> {
    await this.repo
      .createQueryBuilder()
      .update(Usuario)
      .set({ pontuacao: () => `pontuacao + ${delta}` })
      .where('id = :id', { id })
      .execute();
    return this.findById(id);
  }

  async updateRole(id: number, role: Role): Promise<boolean> {
    const result = await this.repo.update(id, { role });
    return (result.affected ?? 0) > 0;
  }

  async deactivate(id: number): Promise<boolean> {
    const result = await this.repo.update(id, { status: false });
    return (result.affected ?? 0) > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await this.repo.count({ where: { email } })) > 0;
  }
}

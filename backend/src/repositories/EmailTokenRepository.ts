import { Repository, DataSource } from 'typeorm';
import { EmailToken } from '../entities/EmailToken';
import { EmailTokenType } from '../shared/constants';
import { v4 as uuidv4 } from 'uuid';

export class EmailTokenRepository {
  private repo: Repository<EmailToken>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(EmailToken);
  }

  /** Cria um token com TTL em minutos. */
  async create(
    usuarioId: number,
    tipo: EmailTokenType,
    ttlMinutes: number,
  ): Promise<string> {
    const token = uuidv4();
    const expiraEm = new Date(Date.now() + ttlMinutes * 60 * 1000);
    const entity = this.repo.create({ usuarioId, token, tipo, expiraEm });
    await this.repo.save(entity);
    return token;
  }

  /** Busca token válido (não expirado, não usado). */
  async findValid(token: string, tipo: EmailTokenType): Promise<EmailToken | null> {
    return this.repo
      .createQueryBuilder('t')
      .where('t.token = :token', { token })
      .andWhere('t.tipo = :tipo', { tipo })
      .andWhere('t.usado = :usado', { usado: false })
      .andWhere('t.expiraEm > :now', { now: new Date() }) // Compatível com PostgreSQL e SQLite
      .getOne();
  }

  async markUsed(token: string): Promise<void> {
    await this.repo.update({ token }, { usado: true });
  }
}

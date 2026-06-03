import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Role } from '@/shared/constants';
import { Campus } from '@/entities/Campus';
import { Curso } from '@/entities/Curso';

@Entity('usuarios')
export class Usuario {
  [key: string]: unknown;
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  nome!: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email!: string;

  /**
   * Senha armazenada como bcrypt hash.
   * select: false → nunca retornado em queries padrão.
   */
  @Column({ type: 'varchar', length: 255, select: false })
  senha!: string;

  /**
   * Nível de acesso do usuário.
   */
  @Column({ type: 'smallint', default: Role.PLAYER })
  role!: Role;

  /** Pontuação acumulada no jogo. */
  @Column({ type: 'int', default: 0 })
  pontuacao!: number;

  /** URL da foto de perfil. */
  @Column({ type: 'varchar', length: 500, nullable: true, default: '' })
  foto!: string | null;

  /** Telefone de contato. */
  @Column({ type: 'varchar', length: 20, nullable: true, default: '' })
  telefone!: string | null;

  /** Campo legado de sexo (0=não definido, 1=masc, 2=fem). Mantido por retrocompatibilidade. */
  @Column({ type: 'smallint', nullable: true, default: 0 })
  sexo!: number | null;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  datanascimento!: Date | null;

  @Column({ type: 'char', length: 2, nullable: true, default: '' })
  uf!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '' })
  cidade!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  turma!: string | null;

  @Column({ type: 'int', nullable: true })
  periodo!: number | null;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  // ── Relacionamentos ──────────────────────────────────────────────────────

  @Column({ name: 'campusid', nullable: true })
  campusId!: number | null;

  @ManyToOne(() => Campus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'campusid' })
  campus!: Campus | null;

  @Column({ name: 'cursoid', nullable: true })
  cursoId!: number | null;

  @ManyToOne(() => Curso, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cursoid' })
  curso!: Curso | null;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified!: boolean;

  // ── Helpers ──────────────────────────────────────────────────────────────

  get isAdmin(): boolean {
    return this.role === Role.SUPER_ADMIN || this.role === Role.ADMIN;
  }

  get isCampusAdmin(): boolean {
    return this.role === Role.CAMPUS_ADMIN;
  }

  /** Retorna objeto seguro sem senha. */
  toSafeJSON() {
    const { senha: _, ...safe } = this as Record<string, unknown>;
    void _;
    return safe;
  }
}

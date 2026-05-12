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

  @Column({ type: 'text' })
  nome!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  /**
   * Senha armazenada como bcrypt hash.
   * select: false → nunca retornado em queries padrão.
   */
  @Column({ type: 'text', select: false })
  senha!: string;

  /**
   * Nível de acesso do usuário.
   */
  @Column({ type: 'int', default: Role.PLAYER })
  role!: Role;

  /** Pontuação acumulada no jogo. */
  @Column({ type: 'int', default: 0 })
  pontuacao!: number;

  /** URL da foto de perfil. */
  @Column({ type: 'text', nullable: true, default: '' })
  foto!: string | null;

  /** Telefone de contato. */
  @Column({ type: 'text', nullable: true, default: '' })
  telefone!: string | null;

  /** Campo legado de sexo (0=não definido, 1=masc, 2=fem). Mantido por retrocompatibilidade. */
  @Column({ type: 'int', nullable: true, default: 0 })
  sexo!: number | null;

  @Column({ type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  datanascimento!: Date | null;

  @Column({ type: 'text', nullable: true, default: '' })
  uf!: string | null;

  @Column({ type: 'text', nullable: true, default: '' })
  cidade!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
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

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt!: Date;

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

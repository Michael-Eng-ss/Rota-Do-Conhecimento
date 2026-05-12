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

  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  /**
   * Senha armazenada como bcrypt hash.
   * select: false → nunca retornado em queries padrão.
   */
  @Column({ type: 'varchar', select: false })
  senha!: string;

  /**
   * Nível de acesso do usuário.
   * Mapeado como VARCHAR no banco (migration necessária para DBs existentes).
   */
  @Column({ type: 'varchar', length: 20, default: Role.PLAYER })
  role!: Role;

  /** Pontuação acumulada no jogo. */
  @Column({ type: 'int', default: 0 })
  pontuacao!: number;

  /** URL da foto de perfil. */
  @Column({ type: 'varchar', nullable: true })
  foto!: string | null;

  /** Telefone de contato. */
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone!: string | null;

  /** Campo legado de sexo (0=não definido, 1=masc, 2=fem). Mantido por retrocompatibilidade. */
  @Column({ type: 'int', nullable: true, default: 0 })
  sexo!: number | null;

  @Column({ type: 'date', nullable: true })
  datanascimento!: Date | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  uf!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
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

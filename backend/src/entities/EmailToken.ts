import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { EmailTokenType } from '../shared/constants';

@Entity('email_tokens')
export class EmailToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id', type: 'int' })
  usuarioId!: number;

  @Column({ type: 'varchar', length: 512, unique: true })
  token!: string;

  @Column({ type: 'varchar', length: 50 })
  tipo!: EmailTokenType;

  @Column({ name: 'expira_em', type: 'timestamptz' })
  expiraEm!: Date;

  @Column({ name: 'usado', type: 'boolean', default: false })
  usado!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

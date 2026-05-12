import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('progresso_perguntas')
export class Progresso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuarioid', type: 'int' })
  usuarioId!: number;

  @Column({ name: 'perguntaid', type: 'int' })
  perguntaId!: number;

  @Column({ name: 'acertou', type: 'boolean', default: false })
  acertou!: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt!: Date;
}

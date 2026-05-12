import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pergunta } from './Pergunta';

@Entity('alternativas')
export class Alternativa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  texto!: string;

  @Column({ name: 'correta', type: 'boolean', default: false })
  correta!: boolean;

  @Column({ name: 'perguntaid', type: 'int' })
  perguntaId!: number;

  @ManyToOne(() => Pergunta, (p) => p.alternativas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'perguntaid' })
  pergunta!: Pergunta;
}

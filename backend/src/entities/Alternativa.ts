import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pergunta } from './Pergunta';

@Entity('alternativas')
export class Alternativa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'perguntasid', type: 'int' })
  perguntasid!: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  conteudo!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagem!: string | null;

  @Column({ type: 'boolean', default: false })
  correta!: boolean;

  @ManyToOne(() => Pergunta, (p) => p.alternativas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'perguntasid' })
  pergunta!: Pergunta;
}

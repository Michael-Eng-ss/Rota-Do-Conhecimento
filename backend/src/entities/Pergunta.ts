import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Categoria }    from './Categoria';
import { Alternativa }  from './Alternativa';
import { PerguntaNivel } from './PerguntaNivel';
import { Quiz }         from './Quiz';

@Entity('perguntas')
export class Pergunta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: true })
  conteudo!: string | null;

  @Column({ name: 'perguntasnivelid', type: 'int' })
  perguntasnivelid!: number;

  @Column({ type: 'int', default: 30 })
  tempo!: number;

  @Column({ name: 'pathimage', type: 'text', nullable: true })
  pathimage!: string | null;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ name: 'categoriasid', type: 'int' })
  categoriasid!: number;

  @Column({ name: 'quizid', type: 'int', nullable: true })
  quizid!: number | null;

  @ManyToOne(() => Categoria, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoriasid' })
  categoria!: Categoria;

  @ManyToOne(() => PerguntaNivel, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'perguntasnivelid' })
  nivel!: PerguntaNivel;

  @ManyToOne(() => Quiz, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'quizid' })
  quiz!: Quiz | null;

  @OneToMany(() => Alternativa, (a) => a.pergunta)
  alternativas!: Alternativa[];
}

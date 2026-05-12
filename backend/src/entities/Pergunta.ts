import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Categoria } from './Categoria';
import { Alternativa } from './Alternativa';
import { Campus } from './Campus';

@Entity('perguntas')
export class Pergunta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  enunciado!: string;

  @Column({ type: 'int', nullable: true })
  dificuldade!: number | null;

  @Column({ name: 'categoriaid', type: 'int', nullable: true })
  categoriaId!: number | null;

  @ManyToOne(() => Categoria, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoriaid' })
  categoria!: Categoria | null;

  /** Campus do qual a pergunta foi originada. */
  @Column({ name: 'campusid', type: 'int', nullable: true })
  campusId!: number | null;

  @ManyToOne(() => Campus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'campusid' })
  campus!: Campus | null;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt!: Date;

  @OneToMany(() => Alternativa, (a) => a.pergunta)
  alternativas!: Alternativa[];
}

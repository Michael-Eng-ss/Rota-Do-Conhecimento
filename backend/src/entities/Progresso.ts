import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario }  from './Usuario';
import { Pergunta } from './Pergunta';

@Entity('progressoperguntas')
export class Progresso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuariosid', type: 'int' })
  usuariosid!: number;

  @Column({ name: 'perguntasid', type: 'int' })
  perguntasid!: number;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuariosid' })
  usuario!: Usuario;

  @ManyToOne(() => Pergunta, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'perguntasid' })
  pergunta!: Pergunta;
}

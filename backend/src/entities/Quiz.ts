import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso }   from './Curso';
import { Usuario } from './Usuario';

@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  titulo!: string;

  @Column({ name: 'cursoid', type: 'int' })
  cursoid!: number;

  @Column({ type: 'text', default: '' })
  imagem!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'boolean', default: false })
  avaliativo!: boolean;

  @Column({ name: 'usuarioid', type: 'int' })
  usuarioid!: number;

  @ManyToOne(() => Curso, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cursoid' })
  curso!: Curso;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuarioid' })
  usuario!: Usuario;
}

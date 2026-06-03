import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from './Curso';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  descricao!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'varchar', length: 500, default: '' })
  imagem!: string;

  @Column({ name: 'cursoid', type: 'int' })
  cursoid!: number;

  @ManyToOne(() => Curso, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cursoid' })
  curso!: Curso;
}

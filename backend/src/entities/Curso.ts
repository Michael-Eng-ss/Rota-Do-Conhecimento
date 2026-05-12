import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  nome!: string;

  @Column({ type: 'text', default: '' })
  imagem!: string;

  @OneToMany(() => Usuario, (u) => u.curso)
  usuarios!: Usuario[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  nome!: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  imagem!: string;

  @OneToMany(() => Usuario, (u) => u.curso)
  usuarios!: Usuario[];
}

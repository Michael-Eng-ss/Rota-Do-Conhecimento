import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', nullable: true })
  imagem!: string | null;

  @OneToMany(() => Usuario, (u) => u.curso)
  usuarios!: Usuario[];
}

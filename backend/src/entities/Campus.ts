import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';

@Entity('campus')
export class Campus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nomecampus', type: 'varchar', length: 150 })
  nome!: string;

  @OneToMany(() => Usuario, (u) => u.campus)
  usuarios!: Usuario[];
}

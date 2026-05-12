import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  nome!: string;

  @Column({ type: 'varchar', nullable: true })
  imagem!: string | null;

  @Column({ name: 'cursoid', type: 'int', nullable: true })
  cursoId!: number | null;
}

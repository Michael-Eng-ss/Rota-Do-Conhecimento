import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('perguntasnivel')
export class PerguntaNivel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  nivel!: number;

  @Column({ type: 'int' })
  pontuacao!: number;

  @Column({ type: 'int' })
  tempo!: number;
}

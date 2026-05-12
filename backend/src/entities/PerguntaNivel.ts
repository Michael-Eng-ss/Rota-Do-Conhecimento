import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pergunta_nivel')
export class PerguntaNivel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'perguntaid', type: 'int' })
  perguntaId!: number;

  @Column({ name: 'nivelid', type: 'int' })
  nivelId!: number;
}

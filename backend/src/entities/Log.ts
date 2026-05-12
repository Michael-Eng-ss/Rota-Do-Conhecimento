import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuariosid', type: 'int' })
  usuariosId!: number;

  @Column({ name: 'descricao', type: 'text' })
  acao!: string;

  @CreateDateColumn({ name: 'datalogin' })
  dataLogin!: Date;
}

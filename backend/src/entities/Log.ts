import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuariosid', type: 'int' })
  usuariosId!: number;

  @Column({ type: 'varchar', length: 255 })
  acao!: string;

  @CreateDateColumn({ name: 'datalogin' })
  dataLogin!: Date;
}

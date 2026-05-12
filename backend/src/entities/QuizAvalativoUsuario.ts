import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('quiz_avaliativo_usuario')
export class QuizAvalativoUsuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuarioid', type: 'int' })
  usuarioId!: number;

  @Column({ name: 'quizid', type: 'int' })
  quizId!: number;

  @Column({ name: 'pontuacao', type: 'int', default: 0 })
  pontuacao!: number;

  @Column({ name: 'concluido', type: 'boolean', default: false })
  concluido!: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt!: Date;
}

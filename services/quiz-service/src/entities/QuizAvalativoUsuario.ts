import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz }    from './Quiz';
import { Usuario } from './Usuario';

@Entity('quiz_avaliativo_usuario')
export class QuizAvalativoUsuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'quizid', type: 'int' })
  quizid!: number;

  @Column({ name: 'usuarioid', type: 'int' })
  usuarioid!: number;

  @Column({ type: 'int', default: 0 })
  pontuacao!: number;

  @Column({ name: 'horainicial', type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  horainicial!: Date;

  @Column({ name: 'horafinal', type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  horafinal!: Date;

  @ManyToOne(() => Quiz, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'quizid' })
  quiz!: Quiz;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'usuarioid' })
  usuario!: Usuario;
}

import { Repository, DataSource } from 'typeorm';
import { QuizAvalativoUsuario } from '../entities/QuizAvalativoUsuario';

export class QuizAvaliativoRepository {
  private repo: Repository<QuizAvalativoUsuario>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(QuizAvalativoUsuario);
  }

  findByUsuario(usuarioid: number): Promise<QuizAvalativoUsuario[]> {
    return this.repo.find({ where: { usuarioid }, order: { id: 'DESC' } });
  }

  findByQuiz(quizid: number): Promise<QuizAvalativoUsuario[]> {
    return this.repo.find({ where: { quizid }, order: { pontuacao: 'DESC' } });
  }

  findById(id: number): Promise<QuizAvalativoUsuario | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<QuizAvalativoUsuario>): Promise<QuizAvalativoUsuario> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

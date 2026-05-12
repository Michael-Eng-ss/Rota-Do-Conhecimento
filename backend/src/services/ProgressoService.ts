import { DataSource } from 'typeorm';
import { ProgressoRepository } from '../repositories/ProgressoRepository';
import { PerguntaRepository }  from '../repositories/PerguntaRepository';
import { AppError } from '../shared/AppError';
import { Progresso } from '../entities/Progresso';

export class ProgressoService {
  private repo: ProgressoRepository;
  private perguntaRepo: PerguntaRepository;

  constructor(dataSource: DataSource) {
    this.repo = new ProgressoRepository(dataSource);
    this.perguntaRepo = new PerguntaRepository(dataSource);
  }

  getByUsuario(usuariosid: number): Promise<Progresso[]> {
    return this.repo.findByUsuario(usuariosid);
  }

  /**
   * Retorna o progresso do usuário para as perguntas de um quiz (quizid).
   * Primeiro busca os ids das perguntas do quiz, depois filtra o progresso.
   */
  async getByQuizAndUsuario(quizid: number, usuariosid: number): Promise<Progresso[]> {
    const perguntas = await this.perguntaRepo.findAll();
    const ids = perguntas
      .filter((p) => p.quizid === quizid)
      .map((p) => p.id);

    if (ids.length === 0) return [];
    return this.repo.findByQuizAndUsuario(ids, usuariosid);
  }

  /**
   * Retorna o progresso do usuário para as perguntas de uma categoria dentro de um quiz.
   */
  async getByCategQuizAndUsuario(
    categoriasid: number,
    quizid: number,
    usuariosid: number,
  ): Promise<Progresso[]> {
    const perguntas = await this.perguntaRepo.findAll();
    const ids = perguntas
      .filter((p) => p.categoriasid === categoriasid && p.quizid === quizid)
      .map((p) => p.id);

    if (ids.length === 0) return [];
    return this.repo.findByQuizAndUsuario(ids, usuariosid);
  }

  create(data: Partial<Progresso>): Promise<Progresso> {
    if (!data.usuariosid) throw AppError.badRequest('ID do usuário é obrigatório');
    if (!data.perguntasid) throw AppError.badRequest('ID da pergunta é obrigatório');
    return this.repo.create(data);
  }
}

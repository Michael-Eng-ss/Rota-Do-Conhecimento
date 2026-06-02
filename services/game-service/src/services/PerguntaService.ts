import { DataSource } from 'typeorm';
import { PerguntaRepository } from '../repositories/PerguntaRepository';
import { AppError } from '../shared/AppError';
import { Pergunta } from '../entities/Pergunta';

export class PerguntaService {
  private repo: PerguntaRepository;

  constructor(dataSource: DataSource) {
    this.repo = new PerguntaRepository(dataSource);
  }

  getAll(): Promise<Pergunta[]> {
    return this.repo.findAll();
  }

  async getById(id: number): Promise<Pergunta> {
    const p = await this.repo.findById(id);
    if (!p) throw AppError.notFound('Pergunta não encontrada');
    return p;
  }

  getCompletas(categoriasid: number, activeOnly: boolean): Promise<Pergunta[]> {
    return this.repo.findCompletasByCategoria(categoriasid, activeOnly);
  }

  /** Filtra perguntas por nível de dificuldade. */
  getByNivel(nivelId: number, activeOnly = true): Promise<Pergunta[]> {
    return this.repo.findByNivel(nivelId, activeOnly);
  }

  /** Filtra perguntas por campus (via categoria → curso). */
  getByCampus(campusId: number, activeOnly = true): Promise<Pergunta[]> {
    return this.repo.findByCampus(campusId, activeOnly);
  }

  /** Retorna perguntas que possuem imagem anexada. */
  getWithImage(activeOnly = true): Promise<Pergunta[]> {
    return this.repo.findWithImage(activeOnly);
  }

  create(data: Partial<Pergunta>): Promise<Pergunta> {
    if (!data.conteudo?.trim()) throw AppError.badRequest('Conteúdo da pergunta é obrigatório');
    if (!data.categoriasid)     throw AppError.badRequest('Categoria é obrigatória');
    if (!data.perguntasnivelid) throw AppError.badRequest('Nível da pergunta é obrigatório');
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<Pergunta>): Promise<Pergunta> {
    await this.getById(id);
    const updated = await this.repo.update(id, data);
    if (!updated) throw AppError.notFound('Pergunta não encontrada');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Pergunta não encontrada');
    return { message: 'Pergunta removida com sucesso' };
  }
}


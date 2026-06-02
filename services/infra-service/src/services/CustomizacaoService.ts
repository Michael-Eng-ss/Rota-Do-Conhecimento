import { DataSource } from 'typeorm';
import { CustomizacaoRepository } from '../repositories/CustomizacaoRepository';
import { AppError } from '../shared/AppError';
import { Customizacao } from '../entities/Customizacao';

const TIPOS_VALIDOS = ['cutscene', 'banner', 'dialogo'];

export class CustomizacaoService {
  private repo: CustomizacaoRepository;

  constructor(dataSource: DataSource) {
    this.repo = new CustomizacaoRepository(dataSource);
  }

  getAll(): Promise<Customizacao[]> {
    return this.repo.findAll();
  }

  getActive(): Promise<Customizacao[]> {
    return this.repo.findActive();
  }

  getByTipo(tipo: string): Promise<Customizacao[]> {
    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw AppError.badRequest(`Tipo inválido. Use: ${TIPOS_VALIDOS.join(', ')}`);
    }
    return this.repo.findByTipo(tipo);
  }

  async getById(id: number): Promise<Customizacao> {
    const item = await this.repo.findById(id);
    if (!item) throw AppError.notFound('Customização não encontrada');
    return item;
  }

  async create(data: Partial<Customizacao>): Promise<Customizacao> {
    if (!data.titulo?.trim()) throw AppError.badRequest('Título é obrigatório');
    if (!data.tipo?.trim()) throw AppError.badRequest('Tipo é obrigatório');
    if (!TIPOS_VALIDOS.includes(data.tipo)) {
      throw AppError.badRequest(`Tipo inválido. Use: ${TIPOS_VALIDOS.join(', ')}`);
    }
    return this.repo.create(data);
  }

  async update(id: number, data: Partial<Customizacao>): Promise<Customizacao> {
    await this.getById(id); // Garante existência
    if (data.tipo && !TIPOS_VALIDOS.includes(data.tipo)) {
      throw AppError.badRequest(`Tipo inválido. Use: ${TIPOS_VALIDOS.join(', ')}`);
    }
    const updated = await this.repo.update(id, data);
    if (!updated) throw AppError.notFound('Customização não encontrada');
    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw AppError.notFound('Customização não encontrada');
    return { message: 'Customização removida com sucesso' };
  }

  async toggleActive(id: number, ativo: boolean): Promise<Customizacao> {
    await this.getById(id);
    const updated = await this.repo.toggleActive(id, ativo);
    if (!updated) throw AppError.notFound('Customização não encontrada');
    return updated;
  }
}

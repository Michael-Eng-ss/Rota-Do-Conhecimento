import { Repository, DataSource } from 'typeorm';
import { Customizacao } from '../entities/Customizacao';

export class CustomizacaoRepository {
  private repo: Repository<Customizacao>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Customizacao);
  }

  findAll(): Promise<Customizacao[]> {
    return this.repo.find({ order: { ordem: 'ASC', id: 'ASC' } });
  }

  findActive(): Promise<Customizacao[]> {
    return this.repo.find({
      where: { ativo: true },
      order: { ordem: 'ASC', id: 'ASC' },
    });
  }

  findByTipo(tipo: string): Promise<Customizacao[]> {
    return this.repo.find({
      where: { tipo },
      order: { ordem: 'ASC' },
    });
  }

  findById(id: number): Promise<Customizacao | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<Customizacao>): Promise<Customizacao> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Customizacao>): Promise<Customizacao | null> {
    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async toggleActive(id: number, ativo: boolean): Promise<Customizacao | null> {
    await this.repo.update(id, { ativo });
    return this.findById(id);
  }
}

import * as service from '@/models/services/categoria.service';
import { Categoria } from '@/entities';
import type { CategoriaCreate, CategoriaUpdate } from '@/models/types';

export class CategoriaController {
  async getAll(): Promise<Categoria[]> {
    const data = await service.getCategoriaList();
    return Categoria.fromApiList(data);
  }

  async getById(id: number): Promise<Categoria> {
    if (!id || id <= 0) throw new Error('ID de categoria inválido');
    const data = await service.getCategoriaById(id);
    return Categoria.fromApi(data);
  }

  async create(payload: CategoriaCreate): Promise<Categoria> {
    if (!payload.descricao?.trim()) throw new Error('Descrição é obrigatória');
    if (!payload.cursoId) throw new Error('Curso é obrigatório');
    const data = await service.createCategoria({ ...payload, descricao: payload.descricao.trim() });
    return Categoria.fromApi(data);
  }

  async update(id: number, updates: CategoriaUpdate): Promise<Categoria> {
    if (!id || id <= 0) throw new Error('ID de categoria inválido');
    const data = await service.updateCategoria(id, updates);
    return Categoria.fromApi(data);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID de categoria inválido');
    return service.deleteCategoria(id);
  }
}

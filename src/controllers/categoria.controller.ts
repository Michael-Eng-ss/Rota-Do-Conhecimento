import * as service from '@/models/services/categoria.service';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '@/models/types';

export class CategoriaController {
  async getAll(): Promise<Categoria[]> {
    return service.getCategoriaList();
  }

  async getById(id: number): Promise<Categoria> {
    if (!id || id <= 0) throw new Error('ID de categoria inválido');
    return service.getCategoriaById(id);
  }

  async create(data: CategoriaCreate): Promise<Categoria> {
    if (!data.descricao?.trim()) throw new Error('Descrição é obrigatória');
    if (!data.cursoId) throw new Error('Curso é obrigatório');
    return service.createCategoria({ ...data, descricao: data.descricao.trim() });
  }

  async update(id: number, updates: CategoriaUpdate): Promise<Categoria> {
    if (!id || id <= 0) throw new Error('ID de categoria inválido');
    return service.updateCategoria(id, updates);
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) throw new Error('ID de categoria inválido');
    return service.deleteCategoria(id);
  }
}

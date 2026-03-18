import * as service from '@/models/services/curso.service';
import type { Curso } from '@/models/types';

export class CursoController {
  async getAll(): Promise<Curso[]> {
    return service.getCursoList();
  }

  async getById(id: number): Promise<Curso> {
    if (!id || id <= 0) throw new Error('ID de curso inválido');
    return service.getCursoById(id);
  }
}

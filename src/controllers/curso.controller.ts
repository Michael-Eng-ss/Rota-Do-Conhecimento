import * as service from '@/models/services/curso.service';
import { Curso } from '@/entities';

export class CursoController {
  async getAll(): Promise<Curso[]> {
    const data = await service.getCursoList();
    return Curso.fromApiList(data);
  }

  async getById(id: number): Promise<Curso> {
    if (!id || id <= 0) throw new Error('ID de curso inválido');
    const data = await service.getCursoById(id);
    return Curso.fromApi(data);
  }
}

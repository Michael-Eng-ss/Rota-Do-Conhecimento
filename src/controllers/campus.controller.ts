import * as service from '@/models/services/campus.service';
import type { Campus } from '@/models/types';

export class CampusController {
  async getAll(): Promise<Campus[]> {
    return service.getCampusList();
  }

  async getById(id: number): Promise<Campus> {
    if (!id || id <= 0) throw new Error('ID de campus inválido');
    return service.getCampusById(id);
  }
}

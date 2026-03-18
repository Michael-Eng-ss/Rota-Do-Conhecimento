import * as service from '@/models/services/campus.service';
import { Campus } from '@/entities';

export class CampusController {
  async getAll(): Promise<Campus[]> {
    const data = await service.getCampusList();
    return Campus.fromApiList(data);
  }

  async getById(id: number): Promise<Campus> {
    if (!id || id <= 0) throw new Error('ID de campus inválido');
    const data = await service.getCampusById(id);
    return Campus.fromApi(data);
  }
}

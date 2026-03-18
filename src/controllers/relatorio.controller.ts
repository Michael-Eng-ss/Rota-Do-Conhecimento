import * as service from '@/models/services/relatorio.service';

export class RelatorioController {
  async getGeral(): Promise<unknown> {
    return service.getRelatorioGeral();
  }

  async getPorCurso(cursoId: number): Promise<unknown> {
    if (!cursoId || cursoId <= 0) throw new Error('ID do curso inválido');
    return service.getRelatorioPorCurso(cursoId);
  }
}

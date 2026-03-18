import * as service from '@/models/services/progresso.service';
import type { ProgressoPerguntas, ProgressoCreate } from '@/models/types';

export class ProgressoController {
  async getByUsuario(usuarioId: number): Promise<ProgressoPerguntas[]> {
    if (!usuarioId || usuarioId <= 0) throw new Error('ID do usuário inválido');
    return service.getProgressoByUsuario(usuarioId);
  }

  async registrar(data: ProgressoCreate): Promise<ProgressoPerguntas> {
    if (!data.usuariosid) throw new Error('Usuário é obrigatório');
    if (!data.perguntasid) throw new Error('Pergunta é obrigatória');
    return service.createProgresso(data);
  }
}

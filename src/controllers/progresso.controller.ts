import * as service from '@/models/services/progresso.service';
import { ProgressoPerguntas } from '@/entities';
import type { ProgressoCreate } from '@/models/types';

export class ProgressoController {
  async getByUsuario(usuarioId: number): Promise<ProgressoPerguntas[]> {
    if (!usuarioId || usuarioId <= 0) throw new Error('ID do usuário inválido');
    const data = await service.getProgressoByUsuario(usuarioId);
    return ProgressoPerguntas.fromApiList(data);
  }

  async registrar(payload: ProgressoCreate): Promise<ProgressoPerguntas> {
    if (!payload.usuariosid) throw new Error('Usuário é obrigatório');
    if (!payload.perguntasid) throw new Error('Pergunta é obrigatória');
    const data = await service.createProgresso(payload);
    return ProgressoPerguntas.fromApi(data);
  }
}

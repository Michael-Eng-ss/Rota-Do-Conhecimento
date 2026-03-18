import * as service from '@/models/services/quiz-avaliativo.service';
import { QuizAvaliativoUsuario } from '@/entities';
import type { QuizAvaliativoCreate } from '@/models/types';

export class QuizAvaliativoController {
  async getByUsuario(usuarioId: number): Promise<QuizAvaliativoUsuario[]> {
    if (!usuarioId || usuarioId <= 0) throw new Error('ID do usuário inválido');
    const data = await service.getQuizAvaliativoByUsuario(usuarioId);
    return QuizAvaliativoUsuario.fromApiList(data);
  }

  async registrar(payload: QuizAvaliativoCreate): Promise<QuizAvaliativoUsuario> {
    if (!payload.usuarioid) throw new Error('Usuário é obrigatório');
    if (!payload.quizid) throw new Error('Quiz é obrigatório');
    const data = await service.createQuizAvaliativo(payload);
    return QuizAvaliativoUsuario.fromApi(data);
  }
}

import * as service from '@/models/services/quiz-avaliativo.service';
import type { QuizAvaliativoUsuario, QuizAvaliativoCreate } from '@/models/types';

export class QuizAvaliativoController {
  async getByUsuario(usuarioId: number): Promise<QuizAvaliativoUsuario[]> {
    if (!usuarioId || usuarioId <= 0) throw new Error('ID do usuário inválido');
    return service.getQuizAvaliativoByUsuario(usuarioId);
  }

  async registrar(data: QuizAvaliativoCreate): Promise<QuizAvaliativoUsuario> {
    if (!data.usuarioid) throw new Error('Usuário é obrigatório');
    if (!data.quizid) throw new Error('Quiz é obrigatório');
    return service.createQuizAvaliativo(data);
  }
}

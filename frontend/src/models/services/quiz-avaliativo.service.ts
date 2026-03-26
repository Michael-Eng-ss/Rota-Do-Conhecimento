import { callEdge } from '@/lib/api-client';
import type { QuizAvaliativoUsuario, QuizAvaliativoCreate } from '@/models/types';

const FN = 'quiz-avaliativo-api';

/** GET /quiz-avaliativo/quiz/:quizId/:skip/:take */
export async function getQuizAvaliativoByQuiz(quizId: number, skip = 0, take = 50): Promise<QuizAvaliativoUsuario[]> {
  const res = await callEdge(FN, `quiz/${quizId}/${skip}/${take}`, { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar resultados');
  return data;
}

/** GET /quiz-avaliativo/:id */
export async function getQuizAvaliativoById(id: number): Promise<QuizAvaliativoUsuario> {
  const res = await callEdge(FN, `${id}`, { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar resultado');
  return data;
}

/** POST /quiz-avaliativo */
export async function createQuizAvaliativo(payload: QuizAvaliativoCreate): Promise<QuizAvaliativoUsuario> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao registrar resultado');
  return data;
}

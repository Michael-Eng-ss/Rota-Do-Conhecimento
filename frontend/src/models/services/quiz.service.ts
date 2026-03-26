import { callEdge } from '@/lib/api-client';
import type { Quiz, QuizCreate, QuizUpdate } from '@/models/types';

const FN = 'quiz-api';

/** GET /quiz/:skip/:take */
export async function getQuizList(skip = 0, take = 50): Promise<Quiz[]> {
  const res = await callEdge(FN, `${skip}/${take}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar quizzes');
  return data;
}

/** GET /quiz/curso/:cursoId/:skip/:take */
export async function getQuizByCurso(cursoId: number, skip = 0, take = 50): Promise<Quiz[]> {
  const res = await callEdge(FN, `curso/${cursoId}/${skip}/${take}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar quizzes do curso');
  return data;
}

/** GET /quiz/usuario/:userId/curso/:cursoId/:skip/:take */
export async function getQuizByUsuarioCurso(userId: number, cursoId: number, skip = 0, take = 50): Promise<Quiz[]> {
  const res = await callEdge(FN, `usuario/${userId}/curso/${cursoId}/${skip}/${take}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar quizzes do usuário');
  return data;
}

/** GET /quiz/:id */
export async function getQuizById(id: number): Promise<Quiz> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar quiz');
  return data;
}

/** POST /quiz */
export async function createQuiz(payload: QuizCreate): Promise<Quiz> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar quiz');
  return data;
}

/** PUT /quiz/:id */
export async function updateQuiz(id: number, updates: QuizUpdate): Promise<Quiz> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar quiz');
  return data;
}

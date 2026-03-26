import { callEdge } from '@/lib/api-client';
import type { ProgressoPerguntas, ProgressoCreate } from '@/models/types';

const FN = 'progresso-perguntas-api';

/** GET /progresso-perguntas/quiz/:quizId/usuario/:userId */
export async function getProgressoByQuizAndUsuario(quizId: number, userId: number): Promise<ProgressoPerguntas[]> {
  const res = await callEdge(FN, `quiz/${quizId}/usuario/${userId}`, { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar progresso');
  return data;
}

/** GET /progresso-perguntas/categoria/:catId/quiz/:quizId/usuario/:userId */
export async function getProgressoByCategoriaQuizAndUsuario(catId: number, quizId: number, userId: number): Promise<ProgressoPerguntas[]> {
  const res = await callEdge(FN, `categoria/${catId}/quiz/${quizId}/usuario/${userId}`, { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar progresso por categoria');
  return data;
}

/** POST /progresso-perguntas */
export async function createProgresso(payload: ProgressoCreate): Promise<ProgressoPerguntas> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao registrar progresso');
  return data;
}

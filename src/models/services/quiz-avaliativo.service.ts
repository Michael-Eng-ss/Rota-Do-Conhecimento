import { callEdge } from '@/lib/api-client';
import type { QuizAvaliativoUsuario, QuizAvaliativoCreate } from '@/models/types';

const FN = 'quiz-avaliativo-api';

export async function getQuizAvaliativoByUsuario(usuarioId: number): Promise<QuizAvaliativoUsuario[]> {
  const res = await callEdge(FN, `usuario/${usuarioId}`, { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar resultados');
  return data;
}

export async function createQuizAvaliativo(payload: QuizAvaliativoCreate): Promise<QuizAvaliativoUsuario> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao registrar resultado');
  return data;
}

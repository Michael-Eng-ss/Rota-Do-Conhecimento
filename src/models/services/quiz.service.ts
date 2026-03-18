import { callEdge } from '@/lib/api-client';
import type { Quiz, QuizCreate, QuizUpdate } from '@/models/types';

const FN = 'quiz-api';

export async function getQuizList(): Promise<Quiz[]> {
  const res = await callEdge(FN, '');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar quizzes');
  return data;
}

export async function getQuizById(id: number): Promise<Quiz> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar quiz');
  return data;
}

export async function createQuiz(payload: QuizCreate): Promise<Quiz> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar quiz');
  return data;
}

export async function updateQuiz(id: number, updates: QuizUpdate): Promise<Quiz> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar quiz');
  return data;
}

export async function deleteQuiz(id: number): Promise<void> {
  const res = await callEdge(FN, `${id}`, { method: 'DELETE', auth: true });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao deletar quiz');
  }
}

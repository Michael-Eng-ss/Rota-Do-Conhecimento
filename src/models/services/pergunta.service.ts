import { callEdge } from '@/lib/api-client';
import type { Pergunta, PerguntaCreate, PerguntaUpdate } from '@/models/types';

const FN = 'perguntas-api';

export async function getPerguntasByQuiz(
  quizId: number,
  categoriaId?: number,
  userId?: number,
  skip = 0,
  take = 20
): Promise<Pergunta[]> {
  let path = `quiz/${quizId}`;
  if (categoriaId) path += `/categoria/${categoriaId}`;
  if (userId) path += `/usuario/${userId}/${skip}/${take}`;
  else if (categoriaId) path += `/${skip}/${take}`;

  const res = await callEdge(FN, path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar perguntas');
  return data;
}

export async function getPerguntaById(id: number): Promise<Pergunta> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar pergunta');
  return data;
}

export async function createPergunta(payload: PerguntaCreate): Promise<Pergunta> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar pergunta');
  return data;
}

export async function updatePergunta(id: number, updates: PerguntaUpdate): Promise<Pergunta> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar pergunta');
  return data;
}

export async function deletePergunta(id: number): Promise<void> {
  const res = await callEdge(FN, `${id}`, { method: 'DELETE', auth: true });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao deletar pergunta');
  }
}

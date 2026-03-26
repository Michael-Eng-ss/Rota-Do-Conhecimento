import { callEdge } from '@/lib/api-client';
import type { Pergunta, PerguntaCreate, PerguntaUpdate } from '@/models/types';

const FN = 'perguntas-api';

/** GET /perguntas/completas/:categoriaId?active=false */
export async function getPerguntasByCategoria(categoriaId: number, activeOnly = true): Promise<Pergunta[]> {
  const path = `completas/${categoriaId}${activeOnly ? '' : '?active=false'}`;
  const res = await callEdge(FN, path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar perguntas');
  return data;
}

/** GET /perguntas/todas */
export async function getAllPerguntas(): Promise<Pergunta[]> {
  const res = await callEdge(FN, 'todas');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar perguntas');
  return data;
}

/** GET /perguntas/:id */
export async function getPerguntaById(id: number): Promise<Pergunta> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar pergunta');
  return data;
}

/** POST /perguntas */
export async function createPergunta(payload: PerguntaCreate): Promise<Pergunta> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar pergunta');
  return data;
}

/** PUT /perguntas/:id */
export async function updatePergunta(id: number, updates: PerguntaUpdate): Promise<Pergunta> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar pergunta');
  return data;
}

/** DELETE /perguntas/:id */
export async function deletePergunta(id: number): Promise<void> {
  const res = await callEdge(FN, `${id}`, { method: 'DELETE', auth: true });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao deletar pergunta');
  }
}

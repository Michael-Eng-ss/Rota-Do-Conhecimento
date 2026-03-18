import { callEdge } from '@/lib/api-client';
import type { PerguntaNivel, PerguntaNivelCreate, PerguntaNivelUpdate } from '@/models/types';

const FN = 'perguntas-nivel-api';

export async function getPerguntaNivelList(): Promise<PerguntaNivel[]> {
  const res = await callEdge(FN, '');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar níveis');
  return data;
}

export async function getPerguntaNivelById(id: number): Promise<PerguntaNivel> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar nível');
  return data;
}

export async function createPerguntaNivel(payload: PerguntaNivelCreate): Promise<PerguntaNivel> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar nível');
  return data;
}

export async function updatePerguntaNivel(id: number, updates: PerguntaNivelUpdate): Promise<PerguntaNivel> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar nível');
  return data;
}

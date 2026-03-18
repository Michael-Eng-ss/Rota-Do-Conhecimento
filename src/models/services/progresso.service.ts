import { callEdge } from '@/lib/api-client';
import type { ProgressoPerguntas, ProgressoCreate } from '@/models/types';

const FN = 'progresso-perguntas-api';

export async function getProgressoByUsuario(usuarioId: number): Promise<ProgressoPerguntas[]> {
  const res = await callEdge(FN, `usuario/${usuarioId}`, { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar progresso');
  return data;
}

export async function createProgresso(payload: ProgressoCreate): Promise<ProgressoPerguntas> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao registrar progresso');
  return data;
}

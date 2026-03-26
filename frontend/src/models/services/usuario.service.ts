import { callEdge } from '@/lib/api-client';
import type { UsuarioPublico, UsuarioCreate, UsuarioUpdate, RankingEntry } from '@/models/types';

const FN = 'usuarios-api';

/** GET /usuarios/:id */
export async function getUsuarioById(id: number): Promise<UsuarioPublico> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar usuário');
  return data;
}

/** POST /usuarios */
export async function createUsuario(payload: UsuarioCreate): Promise<UsuarioPublico> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar usuário');
  return data;
}

/** PUT /usuarios/:id */
export async function updateUsuario(id: number, updates: UsuarioUpdate): Promise<UsuarioPublico> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar usuário');
  return data;
}

/** PUT /usuarios/:id/pontuacao */
export async function updatePontuacao(id: number, pontuacao: number): Promise<UsuarioPublico> {
  const res = await callEdge(FN, `${id}/pontuacao`, { method: 'PUT', body: { pontuacao }, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar pontuação');
  return data;
}

/** GET /usuarios/ranking/:cursoId */
export async function getRanking(cursoId: number): Promise<RankingEntry[]> {
  const res = await callEdge(FN, `ranking/${cursoId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar ranking');
  return data;
}

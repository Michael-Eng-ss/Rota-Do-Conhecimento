import { callEdge, getToken } from '@/lib/api-client';
import type { Customizacao, CustomizacaoCreate, CustomizacaoUpdate } from '../types';

const FN = 'customizacoes-api';

/** Lista todas as customizações (SUPERADMIN) */
export async function getAll(): Promise<Customizacao[]> {
  const res = await callEdge(FN, '', { auth: true });
  if (!res.ok) throw new Error('Erro ao buscar customizações');
  return res.json();
}

/** Lista apenas customizações ativas (público) */
export async function getActive(): Promise<Customizacao[]> {
  const res = await callEdge(FN, 'ativas');
  if (!res.ok) throw new Error('Erro ao buscar customizações ativas');
  return res.json();
}

/** Busca customizações por tipo */
export async function getByTipo(tipo: string): Promise<Customizacao[]> {
  const res = await callEdge(FN, `tipo/${tipo}`, { auth: true });
  if (!res.ok) throw new Error('Erro ao buscar por tipo');
  return res.json();
}

/** Busca customização por ID */
export async function getById(id: number): Promise<Customizacao> {
  const res = await callEdge(FN, `${id}`, { auth: true });
  if (!res.ok) throw new Error('Customização não encontrada');
  return res.json();
}

/** Cria nova customização */
export async function create(data: CustomizacaoCreate): Promise<Customizacao> {
  const res = await callEdge(FN, '', { method: 'POST', body: data, auth: true });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao criar customização');
  }
  return res.json();
}

/** Atualiza customização existente */
export async function update(id: number, data: CustomizacaoUpdate): Promise<Customizacao> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: data, auth: true });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao atualizar customização');
  }
  return res.json();
}

/** Ativa/desativa uma customização */
export async function toggleActive(id: number, ativo: boolean): Promise<Customizacao> {
  const res = await callEdge(FN, `${id}/toggle`, { method: 'PATCH', body: { ativo }, auth: true });
  if (!res.ok) throw new Error('Erro ao alterar status');
  return res.json();
}

/** Remove uma customização */
export async function remove(id: number): Promise<{ message: string }> {
  const res = await callEdge(FN, `${id}`, { method: 'DELETE', auth: true });
  if (!res.ok) throw new Error('Erro ao remover customização');
  return res.json();
}

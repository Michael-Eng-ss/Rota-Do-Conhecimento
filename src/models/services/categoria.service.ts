import { callEdge } from '@/lib/api-client';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '@/models/types';

const FN = 'categorias-api';

export async function getCategoriaList(): Promise<Categoria[]> {
  const res = await callEdge(FN, '');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar categorias');
  return data;
}

export async function getCategoriaById(id: number): Promise<Categoria> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar categoria');
  return data;
}

export async function createCategoria(payload: CategoriaCreate): Promise<Categoria> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar categoria');
  return data;
}

export async function updateCategoria(id: number, updates: CategoriaUpdate): Promise<Categoria> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar categoria');
  return data;
}

export async function deleteCategoria(id: number): Promise<void> {
  const res = await callEdge(FN, `${id}`, { method: 'DELETE', auth: true });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao deletar categoria');
  }
}

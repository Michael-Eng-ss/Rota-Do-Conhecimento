import { callEdge } from '@/lib/api-client';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '@/models/types';

const FN = 'categorias-api';

/** GET /categorias/curso/:cursoId */
export async function getCategoriasByCurso(cursoId: number): Promise<Categoria[]> {
  const res = await callEdge(FN, `curso/${cursoId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar categorias');
  return data;
}

/** GET /categorias/quiz/:quizId */
export async function getCategoriasByQuiz(quizId: number): Promise<Categoria[]> {
  const res = await callEdge(FN, `quiz/${quizId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar categorias do quiz');
  return data;
}

/** GET /categorias/:id */
export async function getCategoriaById(id: number): Promise<Categoria> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar categoria');
  return data;
}

/** POST /categorias */
export async function createCategoria(payload: CategoriaCreate): Promise<Categoria> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar categoria');
  return data;
}

/** PUT /categorias/:id */
export async function updateCategoria(id: number, updates: CategoriaUpdate): Promise<Categoria> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar categoria');
  return data;
}

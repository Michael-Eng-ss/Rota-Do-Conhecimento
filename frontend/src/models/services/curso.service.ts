import { callEdge } from '@/lib/api-client';
import type { Curso } from '@/models/types';

const FN = 'curso-api';

export async function getCursoList(): Promise<Curso[]> {
  const res = await callEdge(FN, '');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar cursos');
  return data;
}

export async function getCursoById(id: number): Promise<Curso> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar curso');
  return data;
}

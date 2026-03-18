import { callEdge } from '@/lib/api-client';
import type { Campus } from '@/models/types';

const FN = 'campus-api';

export async function getCampusList(): Promise<Campus[]> {
  const res = await callEdge(FN, '');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar campus');
  return data;
}

export async function getCampusById(id: number): Promise<Campus> {
  const res = await callEdge(FN, `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar campus');
  return data;
}

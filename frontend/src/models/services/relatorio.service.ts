import { callEdge } from '@/lib/api-client';

const FN = 'relatorios-api';

/** GET /relatorios — requer role admin (role=1) */
export async function getRelatorioGeral(): Promise<unknown> {
  const res = await callEdge(FN, '', { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar relatório');
  return data;
}

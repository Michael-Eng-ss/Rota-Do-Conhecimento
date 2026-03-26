import { callEdge } from '@/lib/api-client';
import type { Alternativa, AlternativaCreate, AlternativaUpdate } from '@/models/types';

const FN = 'alternativas-api';

/** GET /alternativas/pergunta/:perguntaId */
export async function getAlternativasByPergunta(perguntaId: number): Promise<Alternativa[]> {
  const res = await callEdge(FN, `pergunta/${perguntaId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar alternativas');
  return data;
}

/** POST /alternativas */
export async function createAlternativa(payload: AlternativaCreate): Promise<Alternativa> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar alternativa');
  return data;
}

/** PUT /alternativas/:id */
export async function updateAlternativa(id: number, updates: AlternativaUpdate): Promise<Alternativa> {
  const res = await callEdge(FN, `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar alternativa');
  return data;
}

/** DELETE /alternativas/:id */
export async function deleteAlternativa(id: number): Promise<void> {
  const res = await callEdge(FN, `${id}`, { method: 'DELETE', auth: true });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao deletar alternativa');
  }
}

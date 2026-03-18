import { callEdge, type AppUser } from '@/lib/api-client';

export async function apiRegisterUser(userData: {
  nome: string;
  email: string;
  senha: string;
  cursoid: number;
  campusid?: number;
  telefone?: string;
  sexo?: number;
  datanascimento?: string;
  uf?: string;
  cidade?: string;
}) {
  const res = await callEdge('usuarios-api', '', { method: 'POST', body: userData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar');
  return data as AppUser;
}

export async function apiGetUser(id: number) {
  const res = await callEdge('usuarios-api', `${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar usuário');
  return data as AppUser;
}

export async function apiUpdateUser(id: number, updates: Partial<AppUser>) {
  const res = await callEdge('usuarios-api', `${id}`, { method: 'PUT', body: updates, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar');
  return data as AppUser;
}

export async function apiUpdateScore(id: number, pontuacao: number) {
  const res = await callEdge('usuarios-api', `${id}/pontuacao`, { method: 'PUT', body: { pontuacao }, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar pontuação');
  return data as AppUser;
}

export async function apiGetRanking(cursoId: number) {
  const res = await callEdge('usuarios-api', `ranking/${cursoId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar ranking');
  return data as Array<{ id: number; nome: string; foto: string; pontuacao: number }>;
}

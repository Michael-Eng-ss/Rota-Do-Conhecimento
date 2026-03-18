import { callEdge } from '@/lib/api-client';

export async function apiLogin(email: string, senha: string) {
  const res = await callEdge('auth-api', '', { method: 'POST', body: { email, senha } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');
  return data as { token: string; id: number; role: number };
}

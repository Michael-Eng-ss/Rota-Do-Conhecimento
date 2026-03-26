import { callEdge } from '@/lib/api-client';
import type { LoginPayload, LoginResponse } from '@/models/types';

const FN = 'auth-api';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');
  return data;
}

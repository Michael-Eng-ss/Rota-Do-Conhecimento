import { callEdge } from '@/lib/api-client';
import type { LoginPayload, LoginResponse } from '@/models/types';

const FN = 'auth-api';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await callEdge(FN, '', { method: 'POST', body: payload });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');
  return data;
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await callEdge(FN, 'esqueci-senha', { method: 'POST', body: { email } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao solicitar recuperação');
}

export async function resetPassword(token: string, senha: string): Promise<void> {
  const res = await callEdge(FN, 'nova-senha', { method: 'POST', body: { token, senha } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Link inválido ou expirado');
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const res = await callEdge(FN, 'verificar-email', { method: 'POST', body: { token } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao verificar e-mail');
  return data;
}

import { callEdge } from '@/lib/api-client';
import type { UsuarioPublico } from '@/models/types';

const FN = 'admin';

/** GET /admin/usuarios */
export async function getAllUsers(): Promise<UsuarioPublico[]> {
  const res = await callEdge(FN, 'usuarios', { auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar usuários');
  return data;
}

/** PUT /admin/usuarios/:id/role */
export async function updateUserRole(id: number, role: number): Promise<{ success: boolean; message: string }> {
  const res = await callEdge(FN, `usuarios/${id}/role`, { method: 'PUT', body: { role }, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar permissão do usuário');
  return data;
}

/** PUT /admin/usuarios/:id */
export async function updateUser(id: number, payload: { nome?: string; email?: string }): Promise<UsuarioPublico> {
  const res = await callEdge(FN, `usuarios/${id}`, { method: 'PUT', body: payload, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar usuário');
  return data;
}

/** PUT /admin/usuarios/:id/status */
export async function toggleUserStatus(id: number, status: boolean): Promise<{ success: boolean; message: string }> {
  const res = await callEdge(FN, `usuarios/${id}/status`, { method: 'PUT', body: { status }, auth: true });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar status do usuário');
  return data;
}

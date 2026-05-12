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

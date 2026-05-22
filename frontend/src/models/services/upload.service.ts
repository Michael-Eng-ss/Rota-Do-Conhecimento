import { getToken } from '@/lib/api-client';
import type { UploadResponse } from '../types';

const EXPRESS_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Faz upload de uma imagem para o servidor (disco local).
 * Usa FormData / multipart, pois não pode usar JSON para arquivos binários.
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('imagem', file);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${EXPRESS_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao fazer upload da imagem');
  }

  return res.json();
}

/**
 * Remove uma imagem do servidor.
 */
export async function deleteImage(filename: string): Promise<{ message: string }> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${EXPRESS_URL}/upload/${filename}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao remover imagem');
  }

  return res.json();
}

/**
 * Retorna a URL completa para exibir uma imagem.
 */
export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path; // URL absoluta
  return `${EXPRESS_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

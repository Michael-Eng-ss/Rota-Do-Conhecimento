// Shared API client – handles local (Docker/Express) vs cloud (Supabase Edge Functions) routing

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const LOCAL_API_URL = import.meta.env.VITE_API_URL; // ex: http://localhost:4000

const isLocal = !!LOCAL_API_URL;

// Mapeamento para o backend Express local (paths sem prefixo Supabase)
const edgeFnToLocalPath: Record<string, string> = {
  'auth-api': '/auth',
  'usuarios-api': '/usuarios',
  'perguntas-api': '/perguntas',
  'alternativas-api': '/alternativas',
  'campus-api': '/campus',
  'curso-api': '/curso',
  'categorias-api': '/categorias',
  'quiz-api': '/quiz',
  'perguntas-nivel-api': '/perguntas-nivel',
  'progresso-perguntas-api': '/progresso-perguntas',
  'quiz-avaliativo-api': '/quiz-avaliativo',
  'relatorios-api': '/relatorios',
};

export async function callEdge(
  fnName: string,
  path: string = '',
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<Response> {
  const { method = 'GET', body, auth = false } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (isLocal) {
    // Modo local: chama o backend Express sem qualquer prefixo Supabase
    const basePath = edgeFnToLocalPath[fnName] || `/${fnName}`;
    const url = `${LOCAL_API_URL}${basePath}${path ? '/' + path : ''}`;
    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } else {
    // Modo cloud: chama Supabase Edge Functions
    headers['apikey'] = SUPABASE_KEY;
    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const url = `${SUPABASE_URL}/functions/v1/${fnName}${path ? '/' + path : ''}`;
    return fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  }
}

// --- Token / session helpers ---

const AUTH_TOKEN_KEY = 'app_token';
const AUTH_USER_KEY = 'app_user';

export interface AppUser {
  id: number;
  nome: string;
  email: string;
  role: number;
  pontuacao: number;
  foto: string;
  cursoid: number;
  campusid: number | null;
  cidade: string;
  uf: string;
  telefone: string;
  sexo: number;
  turma: string | null;
  periodo: number | null;
  datanascimento: string;
  status: boolean;
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getSavedUser(): AppUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setSavedUser(user: AppUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export async function updateUserScore(userId: number, score: number): Promise<AppUser> {
  const res = await callEdge('usuarios-api', `${userId}/pontuacao`, {
    method: 'PUT',
    body: { pontuacao: score },
    auth: true,
  });
  if (!res.ok) {
    throw new Error('Failed to update score');
  }
  return res.json();
}

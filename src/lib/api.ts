// Helper for calling edge functions or local backend API

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const LOCAL_API_URL = import.meta.env.VITE_API_URL; // ex: http://localhost:4000

/**
 * Detecta automaticamente se está rodando local (Docker) ou na nuvem.
 * - Se VITE_API_URL estiver definida → modo local (Express backend)
 * - Caso contrário → modo nuvem (Edge Functions)
 */
const isLocal = !!LOCAL_API_URL;

/** Mapeia nome da edge function para path da API local */
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
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSavedUser(user: AppUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

async function callEdge(
  fnName: string,
  path: string = '',
  options: {
    method?: string;
    body?: unknown;
    auth?: boolean;
  } = {}
): Promise<Response> {
  const { method = 'GET', body, auth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isLocal) {
    // Modo local: chama Express backend
    const basePath = edgeFnToLocalPath[fnName] || `/${fnName}`;
    const url = `${LOCAL_API_URL}${basePath}${path ? '/' + path : ''}`;

    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } else {
    // Modo nuvem: chama Edge Functions
    headers['apikey'] = SUPABASE_KEY;

    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${SUPABASE_URL}/functions/v1/${fnName}${path ? '/' + path : ''}`;

    return fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// ---- Auth API ----
export async function apiLogin(email: string, senha: string) {
  const res = await callEdge('auth-api', '', { method: 'POST', body: { email, senha } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');
  return data as { token: string; id: number; role: number };
}

// ---- Usuarios API ----
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
  const res = await callEdge('usuarios-api', `${id}`, { method: 'PUT', body: updates });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao atualizar');
  return data as AppUser;
}

export async function apiUpdateScore(id: number, pontuacao: number) {
  const res = await callEdge('usuarios-api', `${id}/pontuacao`, { method: 'PUT', body: { pontuacao } });
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

// ---- Perguntas API ----
export async function apiGetPerguntasByQuiz(quizId: number, categoriaId?: number, userId?: number, skip = 0, take = 20) {
  let path = `quiz/${quizId}`;
  if (categoriaId) path += `/categoria/${categoriaId}`;
  if (userId) path += `/usuario/${userId}/${skip}/${take}`;
  else if (categoriaId) path += `/${skip}/${take}`;

  const res = await callEdge('perguntas-api', path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar perguntas');
  return data as Array<{
    id: number;
    conteudo: string;
    perguntasnivelid: number;
    tempo: number;
    pathimage: string | null;
    status: boolean;
    categoriasid: number;
    quizid: number;
  }>;
}

// ---- Alternativas API ----
export async function apiGetAlternativas(perguntaId: number) {
  const res = await callEdge('alternativas-api', `pergunta/${perguntaId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar alternativas');
  return data as Array<{
    id: number;
    conteudo: string | null;
    imagem: string | null;
    correta: boolean;
    perguntasid: number;
  }>;
}

// ---- Campus API ----
export async function apiGetCampusList() {
  const res = await callEdge('campus-api', '');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar campus');
  return data as Array<{ id: number; nomecampus: string }>;
}

// ---- Curso API ----
export async function apiGetCursoList() {
  const res = await callEdge('curso-api', '');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar cursos');
  return data as Array<{ id: number; nome: string; imagem: string }>;
}

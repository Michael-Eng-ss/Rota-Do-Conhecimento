import { callEdge } from '@/lib/api-client';

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

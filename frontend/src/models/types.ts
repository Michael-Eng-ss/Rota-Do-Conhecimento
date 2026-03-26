// =============================================
// Tipos centralizados do projeto — mapeiam 1:1
// com as tabelas do banco de dados.
// =============================================

// AppUser (interface de sessão do frontend)
export type { AppUser } from '@/lib/api-client';

// ---------- Campus ----------
export interface Campus {
  id: number;
  nomecampus: string;
}

// ---------- Curso ----------
export interface Curso {
  id: number;
  nome: string;
  imagem: string;
}

// ---------- Usuario ----------
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
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

/** Dados públicos do usuário (sem senha) */
export type UsuarioPublico = Omit<Usuario, 'senha'>;

/** Payload para criação de usuário */
export interface UsuarioCreate {
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
}

/** Payload para atualização de usuário */
export type UsuarioUpdate = Partial<Omit<Usuario, 'id' | 'email'>>;

// ---------- Categoria ----------
export interface Categoria {
  id: number;
  descricao: string;
  imagem: string;
  status: boolean;
  cursoId: number;
}

export interface CategoriaCreate {
  descricao: string;
  imagem?: string;
  cursoId: number;
}

export type CategoriaUpdate = Partial<Omit<Categoria, 'id'>>;

// ---------- Pergunta Nível ----------
export interface PerguntaNivel {
  id: number;
  nivel: number;
  pontuacao: number;
  tempo: number;
}

export interface PerguntaNivelCreate {
  nivel: number;
  pontuacao: number;
  tempo: number;
}

export type PerguntaNivelUpdate = Partial<Omit<PerguntaNivel, 'id'>>;

// ---------- Pergunta ----------
export interface Pergunta {
  id: number;
  conteudo: string | null;
  perguntasnivelid: number;
  tempo: number;
  pathimage: string | null;
  status: boolean;
  categoriasid: number;
  quizid: number | null;
}

export interface PerguntaCreate {
  conteudo: string;
  perguntasnivelid: number;
  tempo?: number;
  pathimage?: string;
  categoriasid: number;
  quizid?: number;
}

export type PerguntaUpdate = Partial<Omit<Pergunta, 'id'>>;

/** Pergunta com alternativas embutidas (para exibição no jogo) */
export interface PerguntaCompleta extends Pergunta {
  alternativas: Alternativa[];
}

// ---------- Alternativa ----------
export interface Alternativa {
  id: number;
  conteudo: string | null;
  imagem: string | null;
  correta: boolean;
  perguntasid: number;
}

export interface AlternativaCreate {
  conteudo: string;
  imagem?: string;
  correta: boolean;
  perguntasid: number;
}

export type AlternativaUpdate = Partial<Omit<Alternativa, 'id'>>;

// ---------- Quiz ----------
export interface Quiz {
  id: number;
  titulo: string;
  imagem: string;
  avaliativo: boolean;
  status: boolean;
  cursoid: number;
  usuarioid: number;
}

export interface QuizCreate {
  titulo: string;
  imagem?: string;
  avaliativo?: boolean;
  cursoid: number;
  usuarioid: number;
}

export type QuizUpdate = Partial<Omit<Quiz, 'id'>>;

// ---------- Quiz Avaliativo Usuário ----------
export interface QuizAvaliativoUsuario {
  id: number;
  usuarioid: number;
  quizid: number;
  pontuacao: number;
  horainicial: string;
  horafinal: string;
}

export interface QuizAvaliativoCreate {
  usuarioid: number;
  quizid: number;
  pontuacao?: number;
}

// ---------- Progresso Perguntas ----------
export interface ProgressoPerguntas {
  id: number;
  usuariosid: number;
  perguntasid: number;
}

export interface ProgressoCreate {
  usuariosid: number;
  perguntasid: number;
}

// ---------- Log ----------
export interface Log {
  id: number;
  usuariosid: number;
  datalogin: string;
  descricao: string;
}

// ---------- Ranking ----------
export interface RankingEntry {
  id: number;
  nome: string;
  foto: string;
  pontuacao: number;
}

// ---------- Auth ----------
export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  role: number;
}

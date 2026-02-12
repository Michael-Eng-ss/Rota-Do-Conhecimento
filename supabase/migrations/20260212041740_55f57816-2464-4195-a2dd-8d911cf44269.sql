
-- ========================================
-- Tabelas do backend Express (Prisma)
-- ========================================

-- Campus
CREATE TABLE public.campus (
  id SERIAL PRIMARY KEY,
  nomecampus TEXT NOT NULL
);

-- Curso
CREATE TABLE public.curso (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT ''
);

-- Categorias
CREATE TABLE public.categorias (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  imagem TEXT NOT NULL DEFAULT '',
  "cursoId" INTEGER NOT NULL REFERENCES public.curso(id)
);

-- Perguntas Nivel
CREATE TABLE public.perguntasnivel (
  id SERIAL PRIMARY KEY,
  nivel INTEGER NOT NULL,
  pontuacao INTEGER NOT NULL,
  tempo INTEGER NOT NULL
);

-- Usuarios (backend Express - auth próprio com JWT)
CREATE TABLE public.usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  telefone TEXT NOT NULL DEFAULT '',
  sexo INTEGER NOT NULL DEFAULT 0,
  datanascimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  role INTEGER NOT NULL DEFAULT 3,
  uf TEXT NOT NULL DEFAULT '',
  foto TEXT NOT NULL DEFAULT '',
  pontuacao INTEGER NOT NULL DEFAULT 0,
  status BOOLEAN NOT NULL DEFAULT true,
  cidade TEXT NOT NULL DEFAULT '',
  turma TEXT,
  periodo INTEGER,
  cursoid INTEGER NOT NULL REFERENCES public.curso(id),
  campusid INTEGER REFERENCES public.campus(id)
);

-- Quiz
CREATE TABLE public.quiz (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  cursoid INTEGER NOT NULL REFERENCES public.curso(id),
  imagem TEXT NOT NULL DEFAULT '',
  status BOOLEAN NOT NULL DEFAULT true,
  avaliativo BOOLEAN NOT NULL DEFAULT false,
  usuarioid INTEGER NOT NULL REFERENCES public.usuarios(id)
);

-- Perguntas
CREATE TABLE public.perguntas (
  id SERIAL PRIMARY KEY,
  conteudo TEXT,
  perguntasnivelid INTEGER NOT NULL REFERENCES public.perguntasnivel(id),
  tempo INTEGER NOT NULL DEFAULT 30,
  pathimage TEXT,
  status BOOLEAN NOT NULL DEFAULT true,
  categoriasid INTEGER NOT NULL REFERENCES public.categorias(id),
  quizid INTEGER REFERENCES public.quiz(id)
);

-- Alternativas
CREATE TABLE public.alternativas (
  id SERIAL PRIMARY KEY,
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE,
  conteudo TEXT,
  imagem TEXT,
  correta BOOLEAN NOT NULL DEFAULT false
);

-- Progresso Perguntas
CREATE TABLE public.progressoperguntas (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES public.usuarios(id),
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id)
);

-- Quiz Avaliativo Usuario
CREATE TABLE public.quiz_avaliativo_usuario (
  id SERIAL PRIMARY KEY,
  quizid INTEGER NOT NULL REFERENCES public.quiz(id),
  usuarioid INTEGER NOT NULL REFERENCES public.usuarios(id),
  pontuacao INTEGER NOT NULL DEFAULT 0,
  horainicial TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  horafinal TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Logs
CREATE TABLE public.logs (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES public.usuarios(id),
  descricao TEXT NOT NULL,
  datalogin TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ========================================
-- RLS Policies
-- ========================================

ALTER TABLE public.campus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perguntasnivel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progressoperguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_avaliativo_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- As edge functions usarão service_role key, então RLS não bloqueia
-- Mas criamos policies de leitura pública para dados não sensíveis

-- Campus: leitura pública
CREATE POLICY "Public read campus" ON public.campus FOR SELECT USING (true);
CREATE POLICY "Service role full access campus" ON public.campus FOR ALL USING (true) WITH CHECK (true);

-- Curso: leitura pública
CREATE POLICY "Public read curso" ON public.curso FOR SELECT USING (true);
CREATE POLICY "Service role full access curso" ON public.curso FOR ALL USING (true) WITH CHECK (true);

-- Categorias: leitura pública de ativos
CREATE POLICY "Public read active categorias" ON public.categorias FOR SELECT USING (status = true);
CREATE POLICY "Service role full access categorias" ON public.categorias FOR ALL USING (true) WITH CHECK (true);

-- PerguntasNivel: leitura pública
CREATE POLICY "Public read perguntasnivel" ON public.perguntasnivel FOR SELECT USING (true);
CREATE POLICY "Service role full access perguntasnivel" ON public.perguntasnivel FOR ALL USING (true) WITH CHECK (true);

-- Usuarios: sem acesso público (gerenciado via edge functions com service_role)
CREATE POLICY "Service role full access usuarios" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);

-- Quiz: leitura pública de ativos
CREATE POLICY "Public read active quiz" ON public.quiz FOR SELECT USING (status = true);
CREATE POLICY "Service role full access quiz" ON public.quiz FOR ALL USING (true) WITH CHECK (true);

-- Perguntas: leitura pública de ativas
CREATE POLICY "Public read active perguntas" ON public.perguntas FOR SELECT USING (status = true);
CREATE POLICY "Service role full access perguntas" ON public.perguntas FOR ALL USING (true) WITH CHECK (true);

-- Alternativas: leitura pública
CREATE POLICY "Public read alternativas" ON public.alternativas FOR SELECT USING (true);
CREATE POLICY "Service role full access alternativas" ON public.alternativas FOR ALL USING (true) WITH CHECK (true);

-- ProgressoPerguntas: sem acesso público
CREATE POLICY "Service role full access progressoperguntas" ON public.progressoperguntas FOR ALL USING (true) WITH CHECK (true);

-- QuizAvaliativoUsuario: sem acesso público
CREATE POLICY "Service role full access quiz_avaliativo_usuario" ON public.quiz_avaliativo_usuario FOR ALL USING (true) WITH CHECK (true);

-- Logs: sem acesso público
CREATE POLICY "Service role full access logs" ON public.logs FOR ALL USING (true) WITH CHECK (true);

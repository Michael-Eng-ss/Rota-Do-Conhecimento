-- Migration Init Schema para o Projeto Rota do Conhecimento
-- Reescrita de acordo com o padrão do Backend Node.js

-- 1. Campus
CREATE TABLE IF NOT EXISTS public.campus (
  id SERIAL PRIMARY KEY,
  nomecampus TEXT NOT NULL
);

-- Seed Campus
INSERT INTO public.campus (id, nomecampus) VALUES (1, 'Campus Padrão') ON CONFLICT DO NOTHING;

-- 2. Curso
CREATE TABLE IF NOT EXISTS public.curso (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT ''
);

-- Seed Curso (Importante pois o Frontend cadastra o usuário no curso 1 por default)
INSERT INTO public.curso (id, nome, imagem) VALUES (1, 'Engenharia de Software', '') ON CONFLICT DO NOTHING;

-- 3. Categorias
CREATE TABLE IF NOT EXISTS public.categorias (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  imagem TEXT NOT NULL DEFAULT '',
  cursoid INTEGER NOT NULL REFERENCES public.curso(id)
);

-- Seed Categoria Padrão
INSERT INTO public.categorias (id, descricao, cursoid) VALUES (1, 'Conhecimentos Gerais', 1) ON CONFLICT DO NOTHING;

-- 4. Perguntas Nivel
CREATE TABLE IF NOT EXISTS public.perguntasnivel (
  id SERIAL PRIMARY KEY,
  nivel INTEGER NOT NULL,
  pontuacao INTEGER NOT NULL,
  tempo INTEGER NOT NULL
);

-- Seed Nível
INSERT INTO public.perguntasnivel (id, nivel, pontuacao, tempo) VALUES (1, 1, 10, 30) ON CONFLICT DO NOTHING;

-- 5. Usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  -- Valores default para propriedades opcionais de cadastro
  telefone TEXT DEFAULT '',
  sexo INTEGER DEFAULT 0,
  datanascimento TIMESTAMP WITH TIME ZONE DEFAULT now(),
  role INTEGER DEFAULT 3,
  uf TEXT DEFAULT '',
  foto TEXT DEFAULT '',
  pontuacao INTEGER DEFAULT 0,
  status BOOLEAN DEFAULT true,
  cidade TEXT DEFAULT '',
  turma TEXT,
  periodo INTEGER,
  -- Tornando nullable para permitir defaults no banco em caso de fallback
  cursoid INTEGER REFERENCES public.curso(id) ON DELETE SET NULL,
  campusid INTEGER REFERENCES public.campus(id) ON DELETE SET NULL
);

-- 6. Quiz
CREATE TABLE IF NOT EXISTS public.quiz (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  cursoid INTEGER NOT NULL REFERENCES public.curso(id),
  imagem TEXT NOT NULL DEFAULT '',
  status BOOLEAN NOT NULL DEFAULT true,
  avaliativo BOOLEAN NOT NULL DEFAULT false,
  usuarioid INTEGER NOT NULL REFERENCES public.usuarios(id)
);

-- 7. Perguntas
CREATE TABLE IF NOT EXISTS public.perguntas (
  id SERIAL PRIMARY KEY,
  conteudo TEXT,
  perguntasnivelid INTEGER NOT NULL REFERENCES public.perguntasnivel(id),
  tempo INTEGER NOT NULL DEFAULT 30,
  pathimage TEXT,
  status BOOLEAN NOT NULL DEFAULT true,
  categoriasid INTEGER NOT NULL REFERENCES public.categorias(id),
  quizid INTEGER REFERENCES public.quiz(id)
);

-- 8. Alternativas
CREATE TABLE IF NOT EXISTS public.alternativas (
  id SERIAL PRIMARY KEY,
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE,
  conteudo TEXT,
  imagem TEXT,
  correta BOOLEAN NOT NULL DEFAULT false
);

-- 9. Progresso Perguntas
CREATE TABLE IF NOT EXISTS public.progressoperguntas (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE
);

-- 10. Quiz Avaliativo Usuario
CREATE TABLE IF NOT EXISTS public.quiz_avaliativo_usuario (
  id SERIAL PRIMARY KEY,
  quizid INTEGER NOT NULL REFERENCES public.quiz(id) ON DELETE CASCADE,
  usuarioid INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  pontuacao INTEGER NOT NULL DEFAULT 0,
  horainicial TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  horafinal TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Logs
CREATE TABLE IF NOT EXISTS public.logs (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  datalogin TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

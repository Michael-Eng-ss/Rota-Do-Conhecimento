-- =====================================================
-- ROTA DO CONHECIMENTO — SETUP COMPLETO DO BANCO
-- =====================================================
-- Execute no Supabase: Dashboard → SQL Editor → New Query
-- Rode TUDO de uma vez (Ctrl+Enter ou botão Run)
-- =====================================================

-- Extensão para hash de senha (SHA-256)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- TABELAS
-- =====================================================

-- 1. Campus
CREATE TABLE public.campus (
  id        SERIAL PRIMARY KEY,
  nomecampus TEXT NOT NULL
);

-- 2. Curso
CREATE TABLE public.curso (
  id     SERIAL PRIMARY KEY,
  nome   TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT ''
);

-- 3. Usuarios
CREATE TABLE public.usuarios (
  id              SERIAL PRIMARY KEY,
  nome            TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  senha           TEXT NOT NULL,
  telefone        TEXT DEFAULT '',
  sexo            INTEGER DEFAULT 0,
  datanascimento  TIMESTAMPTZ DEFAULT now(),
  role            INTEGER DEFAULT 3,
  uf              TEXT DEFAULT '',
  foto            TEXT DEFAULT '',
  pontuacao       INTEGER DEFAULT 0,
  status          BOOLEAN DEFAULT true,
  cidade          TEXT DEFAULT '',
  turma           TEXT,
  periodo         INTEGER,
  cursoid         INTEGER REFERENCES public.curso(id) ON DELETE SET NULL,
  campusid        INTEGER REFERENCES public.campus(id) ON DELETE SET NULL
);

-- 4. Categorias  ← coluna "cursoid" em minúsculo SEM aspas
CREATE TABLE public.categorias (
  id        SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  status    BOOLEAN NOT NULL DEFAULT true,
  imagem    TEXT NOT NULL DEFAULT '',
  cursoid   INTEGER NOT NULL REFERENCES public.curso(id)
);

-- 5. Perguntas Nível
CREATE TABLE public.perguntasnivel (
  id        SERIAL PRIMARY KEY,
  nivel     INTEGER NOT NULL,
  pontuacao INTEGER NOT NULL,
  tempo     INTEGER NOT NULL
);

-- 6. Quiz
CREATE TABLE public.quiz (
  id         SERIAL PRIMARY KEY,
  titulo     TEXT NOT NULL,
  cursoid    INTEGER NOT NULL REFERENCES public.curso(id),
  imagem     TEXT NOT NULL DEFAULT '',
  status     BOOLEAN NOT NULL DEFAULT true,
  avaliativo BOOLEAN NOT NULL DEFAULT false,
  usuarioid  INTEGER NOT NULL REFERENCES public.usuarios(id)
);

-- 7. Perguntas
CREATE TABLE public.perguntas (
  id               SERIAL PRIMARY KEY,
  conteudo         TEXT,
  perguntasnivelid INTEGER NOT NULL REFERENCES public.perguntasnivel(id),
  tempo            INTEGER NOT NULL DEFAULT 30,
  pathimage        TEXT,
  status           BOOLEAN NOT NULL DEFAULT true,
  categoriasid     INTEGER NOT NULL REFERENCES public.categorias(id),
  quizid           INTEGER REFERENCES public.quiz(id)
);

-- 8. Alternativas
CREATE TABLE public.alternativas (
  id          SERIAL PRIMARY KEY,
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE,
  conteudo    TEXT,
  imagem      TEXT,
  correta     BOOLEAN NOT NULL DEFAULT false
);

-- 9. Progresso Perguntas
CREATE TABLE public.progressoperguntas (
  id          SERIAL PRIMARY KEY,
  usuariosid  INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE
);

-- 10. Quiz Avaliativo por Usuário
CREATE TABLE public.quiz_avaliativo_usuario (
  id          SERIAL PRIMARY KEY,
  quizid      INTEGER NOT NULL REFERENCES public.quiz(id) ON DELETE CASCADE,
  usuarioid   INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  pontuacao   INTEGER NOT NULL DEFAULT 0,
  horainicial TIMESTAMPTZ NOT NULL DEFAULT now(),
  horafinal   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Logs
CREATE TABLE public.logs (
  id         SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  descricao  TEXT NOT NULL,
  datalogin  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- DADOS INICIAIS (SEEDS)
-- =====================================================

-- Campus
INSERT INTO public.campus (id, nomecampus) VALUES
  (1, 'Campus Padrão');

-- Curso (id=1 é obrigatório — frontend cadastra usuários com cursoid=1)
INSERT INTO public.curso (id, nome, imagem) VALUES
  (1, 'Engenharia de Software', '');

-- Categorias (ambientes do jogo — id 1, 2 e 3 são usados pelo frontend)
INSERT INTO public.categorias (id, descricao, cursoid, status, imagem) VALUES
  (1, 'Ambiente 1 - Auditório',   1, true, ''),
  (2, 'Ambiente 2 - Biblioteca',  1, true, ''),
  (3, 'Boss Final',               1, true, '');

-- Níveis de perguntas
INSERT INTO public.perguntasnivel (id, nivel, pontuacao, tempo) VALUES
  (1, 1, 10, 30),
  (2, 2, 20, 25),
  (3, 3, 30, 20);

-- Usuário ADMIN  (email: admin123@teste.com | senha: admin123 | role=1)
INSERT INTO public.usuarios (nome, email, senha, cursoid, campusid, role, status) VALUES
  (
    'Administrador',
    'admin123@teste.com',
    encode(digest('admin123', 'sha256'), 'hex'),
    1, 1, 1, true
  );

-- Usuário JOGADOR de teste  (email: jogador@teste.com | senha: jogador123 | role=3)
INSERT INTO public.usuarios (nome, email, senha, cursoid, campusid, role, status) VALUES
  (
    'Jogador Teste',
    'jogador@teste.com',
    encode(digest('jogador123', 'sha256'), 'hex'),
    1, 1, 3, true
  );

-- =====================================================
-- AJUSTE DAS SEQUENCES (para IDs não colidirem)
-- =====================================================
SELECT setval('public.campus_id_seq',        (SELECT MAX(id) FROM public.campus));
SELECT setval('public.curso_id_seq',         (SELECT MAX(id) FROM public.curso));
SELECT setval('public.categorias_id_seq',    (SELECT MAX(id) FROM public.categorias));
SELECT setval('public.perguntasnivel_id_seq',(SELECT MAX(id) FROM public.perguntasnivel));
SELECT setval('public.usuarios_id_seq',      (SELECT MAX(id) FROM public.usuarios));

-- =====================================================
-- VERIFICAÇÃO FINAL — deve mostrar contagens corretas
-- =====================================================
SELECT 'campus'          AS tabela, COUNT(*) AS registros FROM public.campus
UNION ALL
SELECT 'curso',                     COUNT(*) FROM public.curso
UNION ALL
SELECT 'categorias',                COUNT(*) FROM public.categorias
UNION ALL
SELECT 'perguntasnivel',            COUNT(*) FROM public.perguntasnivel
UNION ALL
SELECT 'usuarios',                  COUNT(*) FROM public.usuarios
UNION ALL
SELECT 'perguntas',                 COUNT(*) FROM public.perguntas
UNION ALL
SELECT 'alternativas',              COUNT(*) FROM public.alternativas
ORDER BY tabela;

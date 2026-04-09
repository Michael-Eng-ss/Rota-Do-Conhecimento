-- =====================================================
-- SCRIPT DE CORREÇÃO DO BANCO SUPABASE
-- Execute este script no Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New Query
-- =====================================================

-- Extensão necessária para hash de senha
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- 1. CRIAÇÃO DAS TABELAS (sem apagar dados existentes)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.campus (
  id SERIAL PRIMARY KEY,
  nomecampus TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.curso (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
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
  cursoid INTEGER REFERENCES public.curso(id) ON DELETE SET NULL,
  campusid INTEGER REFERENCES public.campus(id) ON DELETE SET NULL
);

-- ATENÇÃO: Se a tabela categorias existir com "cursoId" (aspas), precisamos recriar
-- Verificar e corrigir a coluna cursoId vs cursoid
DO $$
BEGIN
  -- Verifica se a coluna existe com o nome errado "cursoId" (case-sensitive com aspas)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'categorias'
    AND column_name = 'cursoId'
  ) THEN
    -- Renomeia a coluna para cursoid (minúsculo, sem aspas)
    ALTER TABLE public.categorias RENAME COLUMN "cursoId" TO cursoid;
    RAISE NOTICE 'Coluna "cursoId" renomeada para cursoid com sucesso.';
  ELSE
    RAISE NOTICE 'Coluna cursoid já está correta ou tabela não existe.';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.categorias (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  imagem TEXT NOT NULL DEFAULT '',
  cursoid INTEGER NOT NULL REFERENCES public.curso(id)
);

CREATE TABLE IF NOT EXISTS public.perguntasnivel (
  id SERIAL PRIMARY KEY,
  nivel INTEGER NOT NULL,
  pontuacao INTEGER NOT NULL,
  tempo INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  cursoid INTEGER NOT NULL REFERENCES public.curso(id),
  imagem TEXT NOT NULL DEFAULT '',
  status BOOLEAN NOT NULL DEFAULT true,
  avaliativo BOOLEAN NOT NULL DEFAULT false,
  usuarioid INTEGER NOT NULL REFERENCES public.usuarios(id)
);

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

CREATE TABLE IF NOT EXISTS public.alternativas (
  id SERIAL PRIMARY KEY,
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE,
  conteudo TEXT,
  imagem TEXT,
  correta BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.progressoperguntas (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  perguntasid INTEGER NOT NULL REFERENCES public.perguntas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.quiz_avaliativo_usuario (
  id SERIAL PRIMARY KEY,
  quizid INTEGER NOT NULL REFERENCES public.quiz(id) ON DELETE CASCADE,
  usuarioid INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  pontuacao INTEGER NOT NULL DEFAULT 0,
  horainicial TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  horafinal TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.logs (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  datalogin TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- 2. DADOS INICIAIS (SEEDS)
-- =====================================================

-- Campus padrão
INSERT INTO public.campus (id, nomecampus)
VALUES (1, 'Campus Padrão')
ON CONFLICT (id) DO NOTHING;

-- Curso padrão (id=1, pois o frontend registra usuários com cursoid=1)
INSERT INTO public.curso (id, nome, imagem)
VALUES (1, 'Engenharia de Software', '')
ON CONFLICT (id) DO NOTHING;

-- Nível padrão de perguntas
INSERT INTO public.perguntasnivel (id, nivel, pontuacao, tempo)
VALUES
  (1, 1, 10, 30),
  (2, 2, 20, 25),
  (3, 3, 30, 20)
ON CONFLICT (id) DO NOTHING;

-- Categorias (ambientes do jogo) — cursoid em minúsculo (SEM aspas)
INSERT INTO public.categorias (id, descricao, cursoid, status, imagem)
VALUES
  (1, 'Ambiente 1 - Auditório', 1, true, ''),
  (2, 'Ambiente 2 - Biblioteca', 1, true, ''),
  (3, 'Boss Final', 1, true, '')
ON CONFLICT (id) DO NOTHING;

-- Usuário admin (email: admin123@teste.com | senha: admin123)
-- role=1 → admin (pode cadastrar perguntas)
INSERT INTO public.usuarios (nome, email, senha, cursoid, campusid, role, status)
VALUES (
  'Administrador',
  'admin123@teste.com',
  encode(digest('admin123', 'sha256'), 'hex'),
  1,
  1,
  1,
  true
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 3. VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'campus' as tabela, count(*) as registros FROM public.campus
UNION ALL
SELECT 'curso', count(*) FROM public.curso
UNION ALL
SELECT 'categorias', count(*) FROM public.categorias
UNION ALL
SELECT 'perguntasnivel', count(*) FROM public.perguntasnivel
UNION ALL
SELECT 'usuarios', count(*) FROM public.usuarios
UNION ALL
SELECT 'perguntas', count(*) FROM public.perguntas;

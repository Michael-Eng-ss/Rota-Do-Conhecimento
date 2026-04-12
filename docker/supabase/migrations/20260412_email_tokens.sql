-- ============================================================
-- Migração: Confirmação de E-mail e Reset de Senha
-- Execute este script DIRETAMENTE no SQL Editor do Supabase
-- ============================================================

-- 1. Adiciona coluna de e-mail verificado na tabela usuários
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;

-- 2. Cria a tabela de tokens temporários (confirmação e reset)
CREATE TABLE IF NOT EXISTS email_tokens (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token       VARCHAR(64) NOT NULL UNIQUE,
  tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('confirm_email','reset_password')),
  expira_em   TIMESTAMPTZ NOT NULL,
  usado       BOOLEAN NOT NULL DEFAULT false,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_email_tokens_token ON email_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_tokens_usuario ON email_tokens(usuario_id);

-- ============================================================
-- PRONTO! Agora configure as variáveis de ambiente no backend.
-- ============================================================

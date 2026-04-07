-- ============================================================
-- Script: Criar usuário Administrador
-- Projeto: Rota-Do-Conhecimento
-- ============================================================
-- PASSO 1: Garante que exista pelo menos 1 campus
-- PASSO 2: Garante que exista pelo menos 1 curso
-- PASSO 3: Insere o admin usando o ID do curso criado/existente
--
-- ATENÇÃO: Troque antes de rodar:
--   e-mail   → 'admin@rotadoconhecimento.com'
--   senha    → hash SHA-256 da sua senha
--
-- Como gerar o hash SHA-256:
--   Node.js: require('crypto').createHash('sha256').update('SUA_SENHA').digest('hex')
--   Windows: (Get-FileHash -Algorithm SHA256 -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes("SUA_SENHA")))).Hash.ToLower()
-- ============================================================

-- PASSO 1: Cria campus padrão (se ainda não existir nenhum)
INSERT INTO campus (nomecampus)
SELECT 'Campus Padrão'
WHERE NOT EXISTS (SELECT 1 FROM campus LIMIT 1);

-- PASSO 2: Cria curso padrão (se ainda não existir nenhum)
INSERT INTO curso (nome, imagem)
SELECT 'Curso Padrão', ''
WHERE NOT EXISTS (SELECT 1 FROM curso LIMIT 1);

-- PASSO 3: Cria o usuário administrador
INSERT INTO usuarios (
  nome,
  email,
  senha,
  telefone,
  sexo,
  datanascimento,
  role,
  uf,
  foto,
  pontuacao,
  status,
  cidade,
  turma,
  periodo,
  cursoid,
  campusid
)
SELECT
  'Administrador',                                                              -- nome (altere se quiser)
  'admin@rotadoconhecimento.com',                                               -- e-mail (ALTERE!)
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',          -- SHA-256 de "admin" (TROQUE!)
  '',                                                                            -- telefone
  0,                                                                             -- sexo
  NOW(),                                                                         -- datanascimento
  1,                                                                             -- role: 1 = ADMIN
  '',                                                                            -- uf
  '',                                                                            -- foto
  0,                                                                             -- pontuacao
  true,                                                                          -- status
  '',                                                                            -- cidade
  NULL,                                                                          -- turma
  NULL,                                                                          -- periodo
  (SELECT id FROM curso  ORDER BY id LIMIT 1),                                  -- cursoid (primeiro curso)
  (SELECT id FROM campus ORDER BY id LIMIT 1)                                   -- campusid (primeiro campus)
ON CONFLICT (email) DO NOTHING;

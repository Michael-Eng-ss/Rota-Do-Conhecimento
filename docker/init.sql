-- ============================================
-- Script de inicialização do banco de dados
-- Executado automaticamente pelo PostgreSQL
-- na primeira vez que o container sobe.
-- ============================================

-- Tabela: campus
CREATE TABLE IF NOT EXISTS campus (
  id SERIAL PRIMARY KEY,
  nomecampus TEXT NOT NULL
);

-- Tabela: curso
CREATE TABLE IF NOT EXISTS curso (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT ''
);

-- Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  role INTEGER NOT NULL DEFAULT 3,
  pontuacao INTEGER NOT NULL DEFAULT 0,
  foto TEXT NOT NULL DEFAULT '',
  cursoid INTEGER NOT NULL REFERENCES curso(id),
  campusid INTEGER REFERENCES campus(id),
  cidade TEXT NOT NULL DEFAULT '',
  uf TEXT NOT NULL DEFAULT '',
  telefone TEXT NOT NULL DEFAULT '',
  sexo INTEGER NOT NULL DEFAULT 0,
  turma TEXT,
  periodo INTEGER,
  datanascimento TIMESTAMPTZ NOT NULL DEFAULT now(),
  status BOOLEAN NOT NULL DEFAULT true
);

-- Tabela: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT '',
  status BOOLEAN NOT NULL DEFAULT true,
  "cursoId" INTEGER NOT NULL REFERENCES curso(id)
);

-- Tabela: perguntasnivel
CREATE TABLE IF NOT EXISTS perguntasnivel (
  id SERIAL PRIMARY KEY,
  nivel INTEGER NOT NULL,
  pontuacao INTEGER NOT NULL,
  tempo INTEGER NOT NULL
);

-- Tabela: quiz
CREATE TABLE IF NOT EXISTS quiz (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT '',
  avaliativo BOOLEAN NOT NULL DEFAULT false,
  status BOOLEAN NOT NULL DEFAULT true,
  cursoid INTEGER NOT NULL REFERENCES curso(id),
  usuarioid INTEGER NOT NULL REFERENCES usuarios(id)
);

-- Tabela: perguntas
CREATE TABLE IF NOT EXISTS perguntas (
  id SERIAL PRIMARY KEY,
  conteudo TEXT,
  perguntasnivelid INTEGER NOT NULL REFERENCES perguntasnivel(id),
  tempo INTEGER NOT NULL DEFAULT 30,
  pathimage TEXT,
  status BOOLEAN NOT NULL DEFAULT true,
  categoriasid INTEGER NOT NULL REFERENCES categorias(id),
  quizid INTEGER REFERENCES quiz(id)
);

-- Tabela: alternativas
CREATE TABLE IF NOT EXISTS alternativas (
  id SERIAL PRIMARY KEY,
  conteudo TEXT,
  imagem TEXT,
  correta BOOLEAN NOT NULL DEFAULT false,
  perguntasid INTEGER NOT NULL REFERENCES perguntas(id)
);

-- Tabela: progressoperguntas
CREATE TABLE IF NOT EXISTS progressoperguntas (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES usuarios(id),
  perguntasid INTEGER NOT NULL REFERENCES perguntas(id)
);

-- Tabela: quiz_avaliativo_usuario
CREATE TABLE IF NOT EXISTS quiz_avaliativo_usuario (
  id SERIAL PRIMARY KEY,
  usuarioid INTEGER NOT NULL REFERENCES usuarios(id),
  quizid INTEGER NOT NULL REFERENCES quiz(id),
  pontuacao INTEGER NOT NULL DEFAULT 0,
  horainicial TIMESTAMPTZ NOT NULL DEFAULT now(),
  horafinal TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: logs
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  usuariosid INTEGER NOT NULL REFERENCES usuarios(id),
  datalogin TIMESTAMPTZ NOT NULL DEFAULT now(),
  descricao TEXT NOT NULL
);

-- ============================================
-- Dados iniciais
-- ============================================

-- Curso padrão
INSERT INTO curso (nome, imagem) VALUES ('Curso Padrão', '') ON CONFLICT DO NOTHING;

-- Usuário admin (senha: admin123 em SHA-256)
INSERT INTO usuarios (nome, email, senha, cursoid, role)
VALUES (
  'Administrador',
  'admin123@teste.com',
  encode(digest('admin123', 'sha256'), 'hex'),
  1,
  1
) ON CONFLICT (email) DO NOTHING;

-- Usuário jogador (senha: jogador123 em SHA-256)
INSERT INTO usuarios (nome, email, senha, cursoid, role)
VALUES (
  'Jogador Teste',
  'jogador@teste.com',
  encode(digest('jogador123', 'sha256'), 'hex'),
  1,
  3
) ON CONFLICT (email) DO NOTHING;

-- Níveis de perguntas
INSERT INTO perguntasnivel (nivel, pontuacao, tempo) VALUES
  (1, 10, 30),
  (2, 20, 25),
  (3, 30, 20)
ON CONFLICT DO NOTHING;

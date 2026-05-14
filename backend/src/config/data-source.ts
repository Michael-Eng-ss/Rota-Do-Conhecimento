import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// ─────────────────────────────────────────────
// Importações explícitas das entidades
// (necessário para o TestDataSource com ts-jest)
// ─────────────────────────────────────────────
import { Usuario }               from '../entities/Usuario';
import { Campus }                from '../entities/Campus';
import { Curso }                 from '../entities/Curso';
import { Categoria }             from '../entities/Categoria';
import { Pergunta }              from '../entities/Pergunta';
import { Alternativa }           from '../entities/Alternativa';
import { PerguntaNivel }         from '../entities/PerguntaNivel';
import { Quiz }                  from '../entities/Quiz';
import { Progresso }             from '../entities/Progresso';
import { QuizAvalativoUsuario }  from '../entities/QuizAvalativoUsuario';
import { Log }                   from '../entities/Log';
import { EmailToken }            from '../entities/EmailToken';

const ALL_ENTITIES = [
  Usuario, Campus, Curso, Categoria, Pergunta,
  Alternativa, PerguntaNivel, Quiz, Progresso,
  QuizAvalativoUsuario, Log, EmailToken,
];

const MIGRATIONS = [path.join(__dirname, '..', '..', 'migrations', '*.{ts,js}')];

// ─────────────────────────────────────────────
// Configuração de SSL dinâmica
// ─────────────────────────────────────────────

/**
 * Determina a configuração de SSL com base no ambiente:
 * - Testes (SQLite in-memory): sem SSL
 * - URLs locais (localhost/127.0.0.1): sem SSL, mesmo com DATABASE_URL
 * - Produção/Remoto (Supabase, Render etc.): SSL com rejectUnauthorized: false
 */
function buildSSLConfig(): boolean | { rejectUnauthorized: boolean } {
  // Testes usam SQLite — SSL não se aplica
  if (process.env.NODE_ENV === 'test') return false;

  const dbUrl   = process.env.DATABASE_URL;
  const nodeEnv = process.env.NODE_ENV;

  if (dbUrl) {
    // Detecta URLs locais — não precisa de SSL
    const isLocal = /localhost|127\.0\.0\.1|::1/.test(dbUrl);
    if (isLocal) return false;

    // URL remota (Supabase, Render, etc.) — força SSL
    return { rejectUnauthorized: false };
  }

  // Sem DATABASE_URL: usa variáveis individuais
  const host = process.env.DB_HOST || 'localhost';
  const isLocalHost = /localhost|127\.0\.0\.1/.test(host);
  const isProduction = nodeEnv === 'production';

  if (isProduction && !isLocalHost) {
    return { rejectUnauthorized: false };
  }

  return false;
}

// ─────────────────────────────────────────────
// Opções de conexão PostgreSQL (produção/dev)
// ─────────────────────────────────────────────
const postgresOptions: DataSourceOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: buildSSLConfig(),
      entities: ALL_ENTITIES,
      migrations: MIGRATIONS,
      synchronize: false,                        // Nunca em produção
      logging: process.env.NODE_ENV === 'development',
    }
  : {
      type: 'postgres',
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER     || 'quizgame',
      password: process.env.DB_PASSWORD || 'quizgame123',
      database: process.env.DB_NAME     || 'quizgame',
      ssl: buildSSLConfig(),
      entities: ALL_ENTITIES,
      migrations: MIGRATIONS,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    };

/**
 * DataSource principal — PostgreSQL (dev / produção / Supabase).
 * Inicializado em src/index.ts antes de app.listen().
 */
export const AppDataSource = new DataSource(postgresOptions);

// ─────────────────────────────────────────────
// DataSource de Testes — SQLite in-memory
// ─────────────────────────────────────────────
/**
 * DataSource isolado para testes de integração.
 * Cria e destrói o schema automaticamente (synchronize: true).
 * Nunca toca no banco real.
 */
export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: ALL_ENTITIES,  // Classes diretas — sem glob
  synchronize: true,
  dropSchema: true,
  logging: false,
});

/**
 * Retorna o DataSource correto conforme NODE_ENV.
 * Usado pelos repositories e controllers.
 */
export function getDataSource(): DataSource {
  return process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
}

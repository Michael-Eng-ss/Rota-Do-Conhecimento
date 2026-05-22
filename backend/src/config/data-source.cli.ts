/**
 * Data source exclusivo para CLI do TypeORM (migration:run / migration:revert).
 * Exporta apenas UM DataSource — obrigatório pelo CLI.
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

// Carrega .env adequado ao ambiente
if (process.env.NODE_ENV === 'staging') {
  dotenv.config({ path: path.resolve(process.cwd(), '..', '.env.test') });
} else {
  dotenv.config();
}

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
import { Customizacao }          from '../entities/Customizacao';

const ALL_ENTITIES = [
  Usuario, Campus, Curso, Categoria, Pergunta,
  Alternativa, PerguntaNivel, Quiz, Progresso,
  QuizAvalativoUsuario, Log, EmailToken, Customizacao,
];

const MIGRATIONS = [path.join(__dirname, '..', '..', 'migrations', '*.{ts,js}')];

function buildSSLConfig(): boolean | { rejectUnauthorized: boolean } {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const isLocal = /localhost|127\.0\.0\.1|::1/.test(dbUrl);
    if (isLocal) return false;
    return { rejectUnauthorized: false };
  }
  return false;
}

const dataSource = new DataSource(
  process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: buildSSLConfig(),
        entities: ALL_ENTITIES,
        migrations: MIGRATIONS,
        synchronize: false,
        logging: true,
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
        logging: true,
      }
);

export default dataSource;

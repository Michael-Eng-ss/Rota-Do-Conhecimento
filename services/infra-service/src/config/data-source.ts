import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

import { Campus }       from '../entities/Campus';
import { Curso }        from '../entities/Curso';
import { Categoria }    from '../entities/Categoria';
import { Customizacao } from '../entities/Customizacao';

const ALL_ENTITIES = [Campus, Curso, Categoria, Customizacao];

function buildSSLConfig(): boolean | { rejectUnauthorized: boolean } {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const isLocal = /localhost|127\.0\.0\.1|::1/.test(dbUrl);
    if (isLocal) return false;
    return { rejectUnauthorized: false };
  }
  const host = process.env.DB_HOST || 'localhost';
  const isLocalHost = /localhost|127\.0\.0\.1/.test(host);
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && !isLocalHost) return { rejectUnauthorized: false };
  return false;
}

const options = process.env.DATABASE_URL
  ? {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      ssl: buildSSLConfig(),
      entities: ALL_ENTITIES,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }
  : {
      type: 'postgres' as const,
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER     || 'quizgame',
      password: process.env.DB_PASSWORD || 'quizgame123',
      database: process.env.DB_NAME     || 'quizgame',
      ssl: buildSSLConfig(),
      entities: ALL_ENTITIES,
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    };

export const AppDataSource = new DataSource(options);

export function getDataSource(): DataSource {
  return AppDataSource;
}

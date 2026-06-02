import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

import { Usuario }   from '../entities/Usuario';
import { Log }       from '../entities/Log';
import { EmailToken } from '../entities/EmailToken';
import { Campus }    from '../entities/Campus';
import { Curso }     from '../entities/Curso';

const ALL_ENTITIES = [Usuario, Log, EmailToken, Campus, Curso];

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

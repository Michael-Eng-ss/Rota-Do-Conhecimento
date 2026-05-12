import 'reflect-metadata';
import { TestDataSource } from '../../../src/config/data-source';

/**
 * globalSetup — executado UMA vez antes de todas as suites de integração.
 * Inicializa o SQLite in-memory e cria todas as tabelas via synchronize.
 */
export default async function globalSetup(): Promise<void> {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }
}

import { TestDataSource } from '../../../src/config/data-source';

/**
 * globalTeardown — executado UMA vez após todas as suites de integração.
 * Destrói o DataSource SQLite in-memory.
 */
export default async function globalTeardown(): Promise<void> {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
}

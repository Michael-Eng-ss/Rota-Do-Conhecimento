/** @type {import('jest').Config} */
module.exports = {
  displayName: 'integration',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          strict: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 30000,
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  // DataSource compartilhado: inicializado UMA vez antes de todas as suites
  // e destruído UMA vez após todas. Evita conflito entre workers de Jest.
  globalSetup: './tests/integration/setup/globalSetup.ts',
  globalTeardown: './tests/integration/setup/globalTeardown.ts',
  // Roda as suites sequencialmente no mesmo worker para compartilhar o DataSource
  maxWorkers: 1,
  runInBand: true,
};

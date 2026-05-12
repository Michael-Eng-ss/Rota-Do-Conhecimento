import 'reflect-metadata';
import { DataSource } from 'typeorm';
/**
 * DataSource principal — PostgreSQL (dev / produção / Supabase).
 * Inicializado em src/index.ts antes de app.listen().
 */
export declare const AppDataSource: DataSource;
/**
 * DataSource isolado para testes de integração.
 * Cria e destrói o schema automaticamente (synchronize: true).
 * Nunca toca no banco real.
 */
export declare const TestDataSource: DataSource;
/**
 * Retorna o DataSource correto conforme NODE_ENV.
 * Usado pelos repositories e controllers.
 */
export declare function getDataSource(): DataSource;
//# sourceMappingURL=data-source.d.ts.map
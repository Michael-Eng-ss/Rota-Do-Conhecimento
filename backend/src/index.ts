import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './config/data-source';
import { app } from './app';

const PORT = parseInt(process.env.PORT || '4000');

AppDataSource.initialize()
  .then(() => {
    console.log('[TypeORM] Conexão estabelecida com o banco de dados.');
    app.listen(PORT, () => {
      console.log(`[Server] Backend rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('[TypeORM] Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });

import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './config/data-source';
import { app } from './app';

const PORT = parseInt(process.env.PORT || '4001');

AppDataSource.initialize()
  .then(() => {
    console.log('[auth-service] Conexão com banco estabelecida.');
    app.listen(PORT, () => {
      console.log(`[auth-service] Rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('[auth-service] Falha ao conectar ao banco:', err);
    process.exit(1);
  });

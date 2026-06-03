import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './config/data-source';
import { app } from './app';

const PORT = parseInt(process.env.PORT || '4003');

AppDataSource.initialize()
  .then(() => {
    console.log('[quiz-service] Conexão com banco estabelecida.');
    app.listen(PORT, () => {
      console.log(`[quiz-service] Rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('[quiz-service] Falha ao conectar ao banco:', err);
    process.exit(1);
  });

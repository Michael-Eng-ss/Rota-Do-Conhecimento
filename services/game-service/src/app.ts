import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import perguntasRoutes      from './routes/perguntas.routes';
import alternativasRoutes   from './routes/alternativas.routes';
import perguntasNivelRoutes from './routes/perguntas-nivel.routes';
import progressoRoutes      from './routes/progresso-perguntas.routes';

import { errorHandler, notFoundHandler, requestLogger } from './middlewares';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => callback(null, origin || '*'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/perguntas',           perguntasRoutes);
app.use('/alternativas',        alternativasRoutes);
app.use('/perguntas-nivel',     perguntasNivelRoutes);
app.use('/progresso-perguntas', progressoRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ service: 'game-service', status: 'ok' }));

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

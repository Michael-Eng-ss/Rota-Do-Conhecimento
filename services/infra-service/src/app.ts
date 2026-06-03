import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import campusRoutes        from './routes/campus.routes';
import categoriasRoutes    from './routes/categorias.routes';
import cursoRoutes         from './routes/curso.routes';
import customizacoesRoutes from './routes/customizacoes.routes';

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
app.use('/campus',        campusRoutes);
app.use('/categorias',    categoriasRoutes);
app.use('/curso',         cursoRoutes);
app.use('/customizacoes', customizacoesRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ service: 'infra-service', status: 'ok' }));

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

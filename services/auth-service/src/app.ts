import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import authRoutes    from './routes/auth.routes';
import usersRoutes   from './routes/users.routes';
import rankingRoutes from './routes/ranking.routes';

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
app.use('/auth',     authRoutes);
app.use('/usuarios', usersRoutes);
app.use('/ranking',  rankingRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ service: 'auth-service', status: 'ok' }));

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

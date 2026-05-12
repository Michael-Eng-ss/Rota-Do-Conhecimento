import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import authRoutes    from './domains/auth/auth.routes';
import usersRoutes   from './domains/users/users.routes';
import adminRoutes   from './domains/admin/admin.routes';
import rankingRoutes from './domains/ranking/ranking.routes';
import campusRoutes  from './domains/campus/campus.routes';

import { errorHandler, notFoundHandler, requestLogger } from './middlewares';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => callback(null, origin || '*'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ── Body + Logger ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(requestLogger);

// ── Rotas ─────────────────────────────────────────────────────────────────
app.use('/auth',      authRoutes);
app.use('/usuarios',  usersRoutes);
app.use('/admin',     adminRoutes);
app.use('/ranking',   rankingRoutes);
app.use('/campus',    campusRoutes);

// ── Error Handlers ────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

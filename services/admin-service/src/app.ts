import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';

import adminRoutes  from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';

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

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/admin',  adminRoutes);
app.use('/upload', uploadRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ service: 'admin-service', status: 'ok' }));

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

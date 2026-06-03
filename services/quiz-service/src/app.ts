import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import quizRoutes           from './routes/quiz.routes';
import quizAvaliativoRoutes from './routes/quiz-avaliativo.routes';

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
app.use('/quiz',             quizRoutes);
app.use('/quiz-avaliativo',  quizAvaliativoRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ service: 'quiz-service', status: 'ok' }));

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

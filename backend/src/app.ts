import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

// ── Rotas existentes ──────────────────────────────────────────────────────
import authRoutes    from './domains/auth/auth.routes';
import usersRoutes   from './domains/users/users.routes';
import adminRoutes   from './domains/admin/admin.routes';
import rankingRoutes from './domains/ranking/ranking.routes';
import campusRoutes  from './domains/campus/campus.routes';

// ── Novas rotas ────────────────────────────────────────────────────────────
import perguntasRoutes        from './domains/perguntas/perguntas.routes';
import alternativasRoutes     from './domains/alternativas/alternativas.routes';
import categoriasRoutes       from './domains/categorias/categorias.routes';
import cursoRoutes            from './domains/curso/curso.routes';
import quizRoutes             from './domains/quiz/quiz.routes';
import perguntasNivelRoutes   from './domains/perguntas-nivel/perguntas-nivel.routes';
import progressoRoutes        from './domains/progresso-perguntas/progresso-perguntas.routes';
import quizAvaliativoRoutes   from './domains/quiz-avaliativo/quiz-avaliativo.routes';

import { errorHandler, notFoundHandler, requestLogger } from './middlewares';

const app = express();

// ── CORS ───────────────────────────────────────────────────────────────────
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => callback(null, origin || '*'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ── Body + Logger ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(requestLogger);

// ── Rotas existentes ───────────────────────────────────────────────────────
app.use('/auth',      authRoutes);
app.use('/usuarios',  usersRoutes);
app.use('/admin',     adminRoutes);
app.use('/ranking',   rankingRoutes);
app.use('/campus',    campusRoutes);

// ── Novas rotas ────────────────────────────────────────────────────────────
app.use('/perguntas',          perguntasRoutes);
app.use('/alternativas',       alternativasRoutes);
app.use('/categorias',         categoriasRoutes);
app.use('/curso',              cursoRoutes);
app.use('/quiz',               quizRoutes);
app.use('/perguntas-nivel',    perguntasNivelRoutes);
app.use('/progresso-perguntas', progressoRoutes);
app.use('/quiz-avaliativo',    quizAvaliativoRoutes);

// ── Error Handlers ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

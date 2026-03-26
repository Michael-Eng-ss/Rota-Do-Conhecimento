require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Restringe CORS à origem configurada em CORS_ORIGIN (dotenv)
const defaultOrigins = ['http://localhost:8080', 'http://localhost:5173', 'http://localhost'];
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : defaultOrigins;
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(express.json());

// Middlewares globais
const { errorHandler, notFoundHandler, requestLogger } = require('./middlewares');
app.use(requestLogger);

// Domain routes
const authRoutes = require('./domains/auth/auth.routes');
const usersRoutes = require('./domains/users/users.routes');
const { questionsRoutes, alternativesRoutes, progressRoutes, levelsRoutes } = require('./domains/questions');
const { quizRoutes, quizAvalRoutes } = require('./domains/quiz');
const { campusRoutes, cursoRoutes, categoriasRoutes } = require('./domains/catalog');
const reportsRoutes = require('./domains/reports/reports.routes');

// Mount routes — paths simples sem acoplamento à convenção Supabase
app.use('/auth', authRoutes);
app.use('/usuarios', usersRoutes);
app.use('/perguntas', questionsRoutes);
app.use('/alternativas', alternativesRoutes);
app.use('/campus', campusRoutes);
app.use('/curso', cursoRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/quiz', quizRoutes);
app.use('/perguntas-nivel', levelsRoutes);
app.use('/progresso-perguntas', progressRoutes);
app.use('/quiz-avaliativo', quizAvalRoutes);
app.use('/relatorios', reportsRoutes);

// 404 handler (após todas as rotas)
app.use(notFoundHandler);

// Global error handler (deve ser o último middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

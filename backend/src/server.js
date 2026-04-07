require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

<<<<<<< HEAD
// Restringe CORS à origem configurada em CORS_ORIGIN (dotenv)
const defaultOrigins = ['http://localhost:8080', 'http://localhost:5173', 'http://localhost'];
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : defaultOrigins;

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: Postman, chamadas server-side)
    if (!origin) return callback(null, true);
    if (corsOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' não permitida`));
    }
=======
// Configuração de CORS flexível para suportar URLs dinâmicas da Vercel e localhost
app.use(cors({
  origin: function(origin, callback) {
    // Reflete o origin da requisição (permite qualquer um), necessário para credentials: true
    callback(null, origin || '*');
>>>>>>> 5c2de5b754f6fb210558a001fcc23a02e0c2ae10
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Responde a TODOS os preflight OPTIONS antes das rotas
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

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

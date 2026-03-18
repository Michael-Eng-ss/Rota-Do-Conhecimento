require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
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

// Mount routes
app.use('/functions/v1/auth-api', authRoutes);
app.use('/functions/v1/usuarios-api', usersRoutes);
app.use('/functions/v1/perguntas-api', questionsRoutes);
app.use('/functions/v1/alternativas-api', alternativesRoutes);
app.use('/functions/v1/campus-api', campusRoutes);
app.use('/functions/v1/curso-api', cursoRoutes);
app.use('/functions/v1/categorias-api', categoriasRoutes);
app.use('/functions/v1/quiz-api', quizRoutes);
app.use('/functions/v1/perguntas-nivel-api', levelsRoutes);
app.use('/functions/v1/progresso-perguntas-api', progressRoutes);
app.use('/functions/v1/quiz-avaliativo-api', quizAvalRoutes);
app.use('/functions/v1/relatorios-api', reportsRoutes);

// 404 handler (após todas as rotas)
app.use(notFoundHandler);

// Global error handler (deve ser o último middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

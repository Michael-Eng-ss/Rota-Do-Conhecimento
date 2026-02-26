require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { pool } = require('./db');

// Routes
app.use('/functions/v1/auth-api', require('./routes/auth'));
app.use('/functions/v1/usuarios-api', require('./routes/usuarios'));
app.use('/functions/v1/perguntas-api', require('./routes/perguntas'));
app.use('/functions/v1/alternativas-api', require('./routes/alternativas'));
app.use('/functions/v1/campus-api', require('./routes/campus'));
app.use('/functions/v1/curso-api', require('./routes/curso'));
app.use('/functions/v1/categorias-api', require('./routes/categorias'));
app.use('/functions/v1/quiz-api', require('./routes/quiz'));
app.use('/functions/v1/perguntas-nivel-api', require('./routes/perguntasNivel'));
app.use('/functions/v1/progresso-perguntas-api', require('./routes/progressoPerguntas'));
app.use('/functions/v1/quiz-avaliativo-api', require('./routes/quizAvaliativo'));
app.use('/functions/v1/relatorios-api', require('./routes/relatorios'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

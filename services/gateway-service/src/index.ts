import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000');

// Configuração de URLs dos microsserviços (alinhadas aos ports expostos nas Dockerfiles)
const AUTH_SERVICE_URL  = process.env.AUTH_SERVICE_URL  || 'http://localhost:4001';
const GAME_SERVICE_URL  = process.env.GAME_SERVICE_URL  || 'http://localhost:4002';
const QUIZ_SERVICE_URL  = process.env.QUIZ_SERVICE_URL  || 'http://localhost:4003';
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:4004';
const INFRA_SERVICE_URL = process.env.INFRA_SERVICE_URL || 'http://localhost:4005';

// Habilitar CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Log das requisições no gateway
app.use((req, _res, next) => {
  console.log(`[Gateway] ${req.method} ${req.path} -> encaminhando...`);
  next();
});

// ── Definição dos proxies ──
// OBS: Não usamos express.json() antes dos proxies para não drenar a stream da requisição (POST/PUT/Upload).

// Auth Service: /auth, /usuarios, /ranking
app.use(['/auth', '/usuarios', '/ranking'], createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
}));

// Game Service: /perguntas, /alternativas, /perguntas-nivel, /progresso-perguntas
app.use(['/perguntas', '/alternativas', '/perguntas-nivel', '/progresso-perguntas'], createProxyMiddleware({
  target: GAME_SERVICE_URL,
  changeOrigin: true,
}));

// Infra Service: /campus, /categorias, /curso, /customizacoes
app.use(['/campus', '/categorias', '/curso', '/customizacoes'], createProxyMiddleware({
  target: INFRA_SERVICE_URL,
  changeOrigin: true,
}));

// Quiz Service: /quiz, /quiz-avaliativo
app.use(['/quiz', '/quiz-avaliativo'], createProxyMiddleware({
  target: QUIZ_SERVICE_URL,
  changeOrigin: true,
}));

// Admin Service: /admin, /upload, /uploads
app.use(['/admin', '/upload', '/uploads'], createProxyMiddleware({
  target: ADMIN_SERVICE_URL,
  changeOrigin: true,
}));

// Rota de Health Check do Gateway
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gateway-service',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[Gateway] Servidor rodando em http://localhost:${PORT}`);
});

const { AppError } = require('./app-error');

/**
 * Middleware de rota não encontrada (404).
 * Deve ser registrado APÓS todas as rotas.
 */
function notFoundHandler(req, res, next) {
  next(new AppError(`Rota não encontrada: ${req.method} ${req.originalUrl}`, 404));
}

/**
 * Middleware global de tratamento de erros.
 * Diferencia erros operacionais (AppError) de erros inesperados.
 */
function errorHandler(err, req, res, _next) {
  // Status code do erro ou fallback para 500
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Log detalhado para erros inesperados (bugs)
  if (!isOperational) {
    console.error(`[CRITICAL] ${req.method} ${req.originalUrl}:`, {
      message: err.message,
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  } else {
    console.warn(`[WARN] ${req.method} ${req.originalUrl}: ${err.message}`);
  }

  // Resposta padronizada
  const response = {
    status: 'error',
    statusCode,
    message: isOperational ? err.message : 'Erro interno do servidor',
  };

  // Em desenvolvimento, inclui stack trace
  if (process.env.NODE_ENV === 'development' && !isOperational) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { errorHandler, notFoundHandler };

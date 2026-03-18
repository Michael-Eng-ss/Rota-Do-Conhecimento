/**
 * Middleware de logging de requisições.
 * Loga método, path, status e tempo de resposta.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Captura o fim da resposta
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const level = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO';
    console.log(`[${level}] ${req.method} ${req.originalUrl} → ${status} (${duration}ms)`);
    originalEnd.apply(res, args);
  };

  next();
}

module.exports = { requestLogger };

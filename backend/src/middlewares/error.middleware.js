/**
 * Middleware global de tratamento de erros.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Error' });
}

module.exports = { errorHandler };

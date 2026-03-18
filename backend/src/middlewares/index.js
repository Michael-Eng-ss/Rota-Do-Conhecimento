const { requireAuth, requireRole } = require('./auth.middleware');
const { asyncHandler } = require('./async.middleware');
const { errorHandler, notFoundHandler } = require('./error.middleware');
const { AppError } = require('./app-error');
const { validateBody } = require('./validation.middleware');
const { requestLogger } = require('./logger.middleware');

module.exports = {
  requireAuth,
  requireRole,
  asyncHandler,
  errorHandler,
  notFoundHandler,
  AppError,
  validateBody,
  requestLogger,
};

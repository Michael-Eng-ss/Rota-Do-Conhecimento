const { requireAuth, requireRole } = require('./auth.middleware');
const { asyncHandler } = require('./async.middleware');
const { errorHandler } = require('./error.middleware');

module.exports = { requireAuth, requireRole, asyncHandler, errorHandler };

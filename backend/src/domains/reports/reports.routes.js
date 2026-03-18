const router = require('express').Router();
const relatorioController = require('../../controllers/relatorio.controller');
const { asyncHandler, requireAuth, requireRole } = require('../../middlewares');

router.get('/', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  res.json(await relatorioController.getReport());
}));

module.exports = router;

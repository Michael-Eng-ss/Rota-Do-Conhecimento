const router = require('express').Router();
const perguntaNivelController = require('../../controllers/pergunta-nivel.controller');
const { asyncHandler } = require('../../middlewares');

router.get('/', asyncHandler(async (req, res) => {
  res.json(await perguntaNivelController.getAll());
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await perguntaNivelController.getById(req.params.id));
}));

module.exports = router;

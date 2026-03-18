const router = require('express').Router();
const alternativaController = require('../../controllers/alternativa.controller');
const { asyncHandler, requireAuth, requireRole } = require('../../middlewares');

router.get('/pergunta/:perguntaId', asyncHandler(async (req, res) => {
  res.json(await alternativaController.getByPergunta(req.params.perguntaId));
}));

router.post('/', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  const result = await alternativaController.create(req.body);
  res.status(201).json(result);
}));

router.put('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  res.json(await alternativaController.update(req.params.id, req.body));
}));

router.delete('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  await alternativaController.delete(req.params.id);
  res.status(204).send();
}));

module.exports = router;

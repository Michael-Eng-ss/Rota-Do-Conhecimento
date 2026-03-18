const router = require('express').Router();
const progressoController = require('../../controllers/progresso.controller');
const { asyncHandler, requireAuth } = require('../../middlewares');

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const result = await progressoController.create(req.body);
  res.status(201).json(result);
}));

router.get('/quiz/:quizId/usuario/:userId', asyncHandler(async (req, res) => {
  res.json(await progressoController.getByQuizAndUsuario(req.params.quizId, req.params.userId));
}));

router.get('/categoria/:catId/quiz/:quizId/usuario/:userId', asyncHandler(async (req, res) => {
  res.json(await progressoController.getByCategoriaQuizAndUsuario(req.params.catId, req.params.quizId, req.params.userId));
}));

module.exports = router;

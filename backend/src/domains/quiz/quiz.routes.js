const router = require('express').Router();
const quizController = require('../../controllers/quiz.controller');
const { asyncHandler, requireAuth, requireRole, validateBody } = require('../../middlewares');

router.post('/', requireAuth, requireRole(1), validateBody({ titulo: 'string' }), asyncHandler(async (req, res) => {
  const quiz = await quizController.create(req.body);
  res.status(201).json(quiz);
}));

router.get('/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  res.json(await quizController.getByCurso(req.params.cursoId, req.params.skip, req.params.take));
}));

router.get('/usuario/:userId/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  res.json(await quizController.getByUsuarioAndCurso(req.params.userId, req.params.cursoId, req.params.skip, req.params.take));
}));

router.get('/avaliativo/usuario/:userId/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  res.json(await quizController.getByUsuarioAndCurso(req.params.userId, req.params.cursoId, req.params.skip, req.params.take, true));
}));

router.get('/:skip/:take', asyncHandler(async (req, res) => {
  res.json(await quizController.getAll(req.params.skip, req.params.take));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await quizController.getById(req.params.id));
}));

router.put('/:id/status', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  res.json(await quizController.toggleStatus(req.params.id));
}));

router.put('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  res.json(await quizController.update(req.params.id, req.body.titulo, req.body.imagem));
}));

module.exports = router;

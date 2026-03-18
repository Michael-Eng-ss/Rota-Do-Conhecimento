const router = require('express').Router();
const categoriaController = require('../../controllers/categoria.controller');
const { asyncHandler, requireAuth, requireRole, validateBody } = require('../../middlewares');

router.post('/', requireAuth, requireRole(1), validateBody({ descricao: 'string' }), asyncHandler(async (req, res) => {
  const cat = await categoriaController.create(req.body.descricao, req.body.cursoId, req.body.imagem);
  res.status(201).json(cat);
}));

router.get('/curso/:cursoId', asyncHandler(async (req, res) => {
  res.json(await categoriaController.getByCurso(req.params.cursoId));
}));

router.get('/quiz/:quizId', asyncHandler(async (req, res) => {
  res.json(await categoriaController.getByQuiz(req.params.quizId));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await categoriaController.getById(req.params.id));
}));

router.put('/:id/status', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  res.json(await categoriaController.toggleStatus(req.params.id));
}));

router.put('/:id', requireAuth, requireRole(1), validateBody({ descricao: 'string' }), asyncHandler(async (req, res) => {
  res.json(await categoriaController.update(req.params.id, req.body.descricao, req.body.imagem));
}));

module.exports = router;

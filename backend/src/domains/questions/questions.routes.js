const router = require('express').Router();
const perguntaController = require('../../controllers/pergunta.controller');
const { asyncHandler, requireAuth, requireRole, validateBody } = require('../../middlewares');

// GET /completas/:categoriaId
router.get('/completas/:categoriaId', asyncHandler(async (req, res) => {
  const catId = parseInt(req.params.categoriaId);
  if (isNaN(catId)) {
    throw new AppError('Categoria ID inválido', 400);
  }
  const activeOnly = req.query.active !== 'false';
  res.json(await perguntaController.getCompletas(catId, activeOnly));
}));

// GET /todas
router.get('/todas', asyncHandler(async (req, res) => {
  res.json(await perguntaController.getAll());
}));

// GET /quiz/:quizId*
router.get('/quiz/:quizId*', asyncHandler(async (req, res) => {
  const parts = req.path.split('/').filter(Boolean);
  const quizId = parseInt(parts[1]);

  const filters = { skip: 0, take: 20 };
  const catIdx = parts.indexOf('categoria');
  if (catIdx !== -1) filters.categoriaId = parseInt(parts[catIdx + 1]);
  const uIdx = parts.indexOf('usuario');
  if (uIdx !== -1) {
    filters.userId = parseInt(parts[uIdx + 1]);
    filters.skip = parseInt(parts[uIdx + 2]) || 0;
    filters.take = parseInt(parts[uIdx + 3]) || 20;
  } else if (filters.categoriaId) {
    filters.skip = parseInt(parts[catIdx + 2]) || 0;
    filters.take = parseInt(parts[catIdx + 3]) || 20;
  }

  res.json(await perguntaController.getByQuiz(quizId, filters));
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await perguntaController.getById(req.params.id));
}));

// POST /
router.post('/', requireAuth, requireRole(1), validateBody({ conteudo: 'string' }), asyncHandler(async (req, res) => {
  const pergunta = await perguntaController.create(req.body);
  res.status(201).json(pergunta);
}));

// PUT /:id/status
router.put('/:id/status', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  res.json(await perguntaController.toggleStatus(req.params.id));
}));

// PUT /:id
router.put('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  res.json(await perguntaController.update(req.params.id, req.body));
}));

// DELETE /:id
router.delete('/:id', requireAuth, requireRole(1), asyncHandler(async (req, res) => {
  await perguntaController.delete(req.params.id);
  res.status(204).send();
}));

module.exports = router;

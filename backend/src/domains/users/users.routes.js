const router = require('express').Router();
const usuarioController = require('../../controllers/usuario.controller');
const { asyncHandler, requireAuth, validateBody } = require('../../middlewares');

// POST / - create user
router.post('/', validateBody({ nome: 'string', email: 'string', senha: 'string' }), asyncHandler(async (req, res) => {
  const user = await usuarioController.create(req.body);
  res.status(201).json(user);
}));

// GET /ranking/:cursoId
router.get('/ranking/:cursoId', asyncHandler(async (req, res) => {
  const ranking = await usuarioController.getRanking(req.params.cursoId);
  res.json(ranking);
}));

// GET /curso/:cursoId/:skip/:take
router.get('/curso/:cursoId/:skip/:take', asyncHandler(async (req, res) => {
  const { cursoId, skip, take } = req.params;
  const users = await usuarioController.findByCurso(cursoId, skip, take);
  res.json(users);
}));

// GET /:id
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await usuarioController.getById(req.params.id);
  res.json(user);
}));

// PUT /:id
router.put('/:id', requireAuth, asyncHandler(async (req, res) => {
  const user = await usuarioController.update(req.params.id, req.body);
  res.json(user);
}));

// PUT /:id/senha
router.put('/:id/senha', requireAuth, validateBody({ senha: 'string' }), asyncHandler(async (req, res) => {
  const result = await usuarioController.updatePassword(req.params.id, req.body.senha);
  res.json(result);
}));

// PUT /:id/pontuacao
router.put('/:id/pontuacao', requireAuth, asyncHandler(async (req, res) => {
  const user = await usuarioController.updateScore(req.params.id, req.body.pontuacao);
  res.json(user);
}));

module.exports = router;

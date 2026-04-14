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

// GET /:id — requer autenticação (usuários autenticados podem ver qualquer perfil)
router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
  const user = await usuarioController.getById(req.params.id);
  res.json(user);
}));

// PUT /:id — apenas o próprio usuário ou um admin pode atualizar
router.put('/:id', requireAuth, asyncHandler(async (req, res) => {
  const targetId = parseInt(req.params.id);
  if (req.user.id !== targetId && req.user.role !== 1) {
    return res.status(403).json({ message: 'Sem permissão para editar este perfil' });
  }
  const user = await usuarioController.update(req.params.id, req.body);
  res.json(user);
}));

// PUT /:id/senha — apenas o próprio usuário ou um admin pode alterar a senha
router.put('/:id/senha', requireAuth, validateBody({ senha: 'string' }), asyncHandler(async (req, res) => {
  const targetId = parseInt(req.params.id);
  if (req.user.id !== targetId && req.user.role !== 1) {
    return res.status(403).json({ message: 'Sem permissão para alterar esta senha' });
  }
  const result = await usuarioController.updatePassword(req.params.id, req.body.senha);
  res.json(result);
}));

// PUT /:id/pontuacao — apenas o próprio usuário ou um admin pode atualizar a pontuação
router.put('/:id/pontuacao', requireAuth, asyncHandler(async (req, res) => {
  const targetId = parseInt(req.params.id);
  if (req.user.id !== targetId && req.user.role !== 1) {
    return res.status(403).json({ message: 'Sem permissão para atualizar esta pontuação' });
  }
  const user = await usuarioController.updateScore(req.params.id, req.body.pontuacao);
  res.json(user);
}));

module.exports = router;

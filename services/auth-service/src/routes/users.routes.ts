import { Router } from 'express';
import { usuarioController } from '../controllers/UsuarioController';
import { asyncHandler, requireAuth, validateBody } from '../middlewares';

const router = Router();

/** POST / — cadastro de novo jogador (público). */
router.post(
  '/',
  validateBody({ nome: 'string', email: 'string', senha: 'string' }),
  asyncHandler(usuarioController.create),
);

/** GET /curso/:cursoId — lista usuários por curso (público). */
router.get('/curso/:cursoId', asyncHandler(usuarioController.findByCurso));

/** GET /:id — perfil de usuário (requer auth). */
router.get('/:id', requireAuth, asyncHandler(usuarioController.getById));

/** PUT /:id — atualizar perfil (requer auth; o próprio usuário ou admin). */
router.put('/:id', requireAuth, asyncHandler(usuarioController.update));

/** PUT /:id/senha — alterar senha (requer auth). */
router.put(
  '/:id/senha',
  requireAuth,
  validateBody({ senha: 'string' }),
  asyncHandler(usuarioController.updatePassword),
);

/** PUT /:id/pontuacao — atualizar pontuação (requer auth). */
router.put('/:id/pontuacao', requireAuth, asyncHandler(usuarioController.updateScore));

export default router;

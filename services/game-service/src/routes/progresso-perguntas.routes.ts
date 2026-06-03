import { Router } from 'express';
import { progressoController } from '../controllers/ProgressoController';
import { asyncHandler, requireAuth } from '../middlewares';

const router = Router();

/** GET /progresso-perguntas/quiz/:quizId/usuario/:userId */
router.get(
  '/quiz/:quizId/usuario/:userId',
  requireAuth,
  asyncHandler(progressoController.getByQuizAndUsuario),
);

/** GET /progresso-perguntas/categoria/:catId/quiz/:quizId/usuario/:userId */
router.get(
  '/categoria/:catId/quiz/:quizId/usuario/:userId',
  requireAuth,
  asyncHandler(progressoController.getByCategQuizAndUsuario),
);

/** POST /progresso-perguntas — registrar (autenticado) */
router.post('/', requireAuth, asyncHandler(progressoController.create));

export default router;

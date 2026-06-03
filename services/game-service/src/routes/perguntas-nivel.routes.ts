import { Router } from 'express';
import { perguntaNivelController } from '../controllers/PerguntaNivelController';
import { asyncHandler, requireAuth, requireAdmin } from '../middlewares';

const router = Router();

/** GET /perguntas-nivel — lista todos (público) */
router.get('/', asyncHandler(perguntaNivelController.getAll));

/** GET /perguntas-nivel/:id — detalhe (público) */
router.get('/:id', asyncHandler(perguntaNivelController.getById));

/** POST /perguntas-nivel — criar (admin) */
router.post('/', requireAuth, requireAdmin, asyncHandler(perguntaNivelController.create));

/** PUT /perguntas-nivel/:id — editar (admin) */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(perguntaNivelController.update));

/** DELETE /perguntas-nivel/:id — remover (admin) */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(perguntaNivelController.delete));

export default router;

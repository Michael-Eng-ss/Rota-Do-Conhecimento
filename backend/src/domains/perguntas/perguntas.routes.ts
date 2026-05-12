import { Router } from 'express';
import { perguntaController } from '../../controllers/PerguntaController';
import { asyncHandler, requireAuth, requireAdmin } from '../../middlewares';

const router = Router();

/** GET /perguntas/todas — lista todas as perguntas (público) */
router.get('/todas', asyncHandler(perguntaController.getAll));

/** GET /perguntas/completas/:categoriaId?active=false — com alternativas (público) */
router.get('/completas/:categoriaId', asyncHandler(perguntaController.getCompletas));

/** GET /perguntas/:id — detalhe (público) */
router.get('/:id', asyncHandler(perguntaController.getById));

/** POST /perguntas — criar (admin) */
router.post('/', requireAuth, requireAdmin, asyncHandler(perguntaController.create));

/** PUT /perguntas/:id — editar (admin) */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(perguntaController.update));

/** DELETE /perguntas/:id — remover (admin) */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(perguntaController.delete));

export default router;

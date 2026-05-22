import { Router } from 'express';
import { perguntaController } from '../../controllers/PerguntaController';
import { asyncHandler, requireAuth, requireAdmin } from '../../middlewares';

const router = Router();

/** GET /perguntas/todas — lista todas as perguntas (público) */
router.get('/todas', asyncHandler(perguntaController.getAll));

/** GET /perguntas/completas/:categoriaId?active=false — com alternativas (público) */
router.get('/completas/:categoriaId', asyncHandler(perguntaController.getCompletas));

/** GET /perguntas/nivel/:nivelId?active=false — filtrar por nível (público) */
router.get('/nivel/:nivelId', asyncHandler(perguntaController.getByNivel));

/** GET /perguntas/campus/:campusId?active=false — filtrar por campus (público) */
router.get('/campus/:campusId', asyncHandler(perguntaController.getByCampus));

/** GET /perguntas/com-imagem?active=false — perguntas com imagem (público) */
router.get('/com-imagem', asyncHandler(perguntaController.getWithImage));

/** GET /perguntas/:id — detalhe (público) */
router.get('/:id', asyncHandler(perguntaController.getById));

/** POST /perguntas — criar (admin) */
router.post('/', requireAuth, requireAdmin, asyncHandler(perguntaController.create));

/** PUT /perguntas/:id — editar (admin) */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(perguntaController.update));

/** DELETE /perguntas/:id — remover (admin) */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(perguntaController.delete));

export default router;


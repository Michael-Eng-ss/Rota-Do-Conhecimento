import { Router } from 'express';
import { alternativaController } from '../controllers/AlternativaController';
import { asyncHandler, requireAuth, requireAdmin } from '../middlewares';

const router = Router();

/** GET /alternativas/pergunta/:perguntaId — por pergunta (público) */
router.get('/pergunta/:perguntaId', asyncHandler(alternativaController.getByPergunta));

/** POST /alternativas — criar (admin) */
router.post('/', requireAuth, requireAdmin, asyncHandler(alternativaController.create));

/** PUT /alternativas/:id — editar (admin) */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(alternativaController.update));

/** DELETE /alternativas/:id — remover (admin) */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(alternativaController.delete));

export default router;

import { Router } from 'express';
import { cursoController } from '../controllers/CursoController';
import { asyncHandler, requireAuth, requireAdmin } from '../middlewares';

const router = Router();

/** GET /curso — lista todos (público) */
router.get('/', asyncHandler(cursoController.getAll));

/** GET /curso/:id — detalhe (público) */
router.get('/:id', asyncHandler(cursoController.getById));

/** POST /curso — criar (admin) */
router.post('/', requireAuth, requireAdmin, asyncHandler(cursoController.create));

/** PUT /curso/:id — editar (admin) */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(cursoController.update));

/** DELETE /curso/:id — remover (admin) */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(cursoController.delete));

export default router;

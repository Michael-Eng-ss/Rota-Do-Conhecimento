import { Router } from 'express';
import { campusController } from '../../controllers/CampusController';
import {
  asyncHandler,
  requireAuth,
  requireAdmin,
} from '../../middlewares';

const router = Router();

/** GET /campus — lista todos os campus (público). */
router.get('/', asyncHandler(campusController.getAll));

/** GET /campus/:id — detalhes de um campus (público). */
router.get('/:id', asyncHandler(campusController.getById));

/** POST /campus — criar campus (apenas ADMIN+). */
router.post('/', requireAuth, requireAdmin, asyncHandler(campusController.create));

/** PUT /campus/:id — editar campus (apenas ADMIN+). */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(campusController.update));

/** DELETE /campus/:id — remover campus (apenas ADMIN+). */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(campusController.delete));

export default router;

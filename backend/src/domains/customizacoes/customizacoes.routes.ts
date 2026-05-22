import { Router } from 'express';
import { customizacaoController } from '../../controllers/CustomizacaoController';
import { asyncHandler, requireAuth, requireSuperAdmin } from '../../middlewares';

const router = Router();

/** GET /customizacoes — lista todas (SUPERADMIN) */
router.get('/', requireAuth, requireSuperAdmin, asyncHandler(customizacaoController.getAll));

/** GET /customizacoes/ativas — apenas ativas (público, para o jogo usar) */
router.get('/ativas', asyncHandler(customizacaoController.getActive));

/** GET /customizacoes/tipo/:tipo — filtrar por tipo (SUPERADMIN) */
router.get('/tipo/:tipo', requireAuth, requireSuperAdmin, asyncHandler(customizacaoController.getByTipo));

/** GET /customizacoes/:id — detalhe (SUPERADMIN) */
router.get('/:id', requireAuth, requireSuperAdmin, asyncHandler(customizacaoController.getById));

/** POST /customizacoes — criar (SUPERADMIN) */
router.post('/', requireAuth, requireSuperAdmin, asyncHandler(customizacaoController.create));

/** PUT /customizacoes/:id — editar (SUPERADMIN) */
router.put('/:id', requireAuth, requireSuperAdmin, asyncHandler(customizacaoController.update));

/** PATCH /customizacoes/:id/toggle — ativar/desativar (SUPERADMIN) */
router.patch('/:id/toggle', requireAuth, requireSuperAdmin, asyncHandler(customizacaoController.toggleActive));

/** DELETE /customizacoes/:id — remover (SUPERADMIN) */
router.delete('/:id', requireAuth, requireSuperAdmin, asyncHandler(customizacaoController.delete));

export default router;

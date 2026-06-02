import { Router } from 'express';
import { categoriaController } from '../../controllers/CategoriaController';
import { asyncHandler, requireAuth, requireAdmin } from '../../middlewares';

const router = Router();

/** GET /categorias — lista todas (público) */
router.get('/', asyncHandler(categoriaController.getAll));

/** GET /categorias/curso/:cursoId — filtra por curso (público) */
router.get('/curso/:cursoId', asyncHandler(categoriaController.getByCurso));

/** GET /categorias/:id — detalhe (público) */
router.get('/:id', asyncHandler(categoriaController.getById));

/** POST /categorias — criar (admin) */
router.post('/', requireAuth, requireAdmin, asyncHandler(categoriaController.create));

/** PUT /categorias/:id — editar (admin) */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(categoriaController.update));

/** DELETE /categorias/:id — remover (admin) */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(categoriaController.delete));

export default router;

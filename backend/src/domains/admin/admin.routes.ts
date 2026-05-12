import { Router } from 'express';
import { adminController } from '../../controllers/AdminController';
import {
  asyncHandler,
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
  requireCampusAdmin,
  requireCampusOwner,
} from '../../middlewares';

const router = Router();

/**
 * Todas as rotas deste módulo exigem autenticação.
 * A tela de admin é acessada diretamente pela URL (/admin).
 * O back-end valida o role no JWT — o front-end NÃO precisa de lógica para "esconder" o botão.
 */
router.use(requireAuth);

/**
 * POST /admin/admins
 * Cria um novo admin (SUPER_ADMIN pode criar ADMIN ou CAMPUS_ADMIN;
 * ADMIN pode criar apenas CAMPUS_ADMIN).
 */
router.post(
  '/admins',
  requireSuperAdmin,
  asyncHandler(adminController.createAdmin),
);

/**
 * PUT /admin/usuarios/:id/role
 * Promove/altera o role de um usuário.
 * Apenas SUPER_ADMIN pode promover.
 */
router.put(
  '/usuarios/:id/role',
  requireSuperAdmin,
  asyncHandler(adminController.promoteUser),
);

/**
 * GET /admin/usuarios
 * Lista todos os usuários.
 * Requer ADMIN ou SUPER_ADMIN.
 */
router.get('/usuarios', requireAdmin, asyncHandler(adminController.listAll));

/**
 * GET /admin/campus/:id/usuarios
 * Lista usuários de um campus específico.
 * CAMPUS_ADMIN só acessa o próprio campus.
 */
router.get(
  '/campus/:id/usuarios',
  requireCampusAdmin,
  requireCampusOwner,
  asyncHandler(adminController.listByCampus),
);

export default router;

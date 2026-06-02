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
 */
router.use(requireAuth);

/**
 * POST /admin/admins
 * Cria um novo admin (SUPER_ADMIN pode criar ADMIN ou CAMPUS_ADMIN).
 */
router.post(
  '/admins',
  requireSuperAdmin,
  asyncHandler(adminController.createAdmin),
);

/**
 * PUT /admin/usuarios/:id/role
 * Promove/altera o role de um usuário.
 */
router.put(
  '/usuarios/:id/role',
  requireSuperAdmin,
  asyncHandler(adminController.promoteUser),
);

/**
 * PUT /admin/usuarios/:id/status
 * Ativa ou desativa um usuário.
 */
router.put(
  '/usuarios/:id/status',
  requireAdmin,
  asyncHandler(adminController.toggleStatus),
);

/**
 * PUT /admin/usuarios/:id
 * Edita dados do usuário (nome, email, etc.).
 */
router.put(
  '/usuarios/:id',
  requireAdmin,
  asyncHandler(adminController.updateUser),
);

/**
 * GET /admin/usuarios/:id
 * Retorna o perfil completo de um usuário.
 */
router.get(
  '/usuarios/:id',
  requireAdmin,
  asyncHandler(adminController.getUserById),
);

/**
 * GET /admin/usuarios
 * Lista todos os usuários (incluindo inativos).
 */
router.get('/usuarios', requireAdmin, asyncHandler(adminController.listAll));

/**
 * GET /admin/campus/:id/usuarios
 * Lista usuários de um campus específico (CAMPUS_ADMIN só acessa o próprio).
 */
router.get(
  '/campus/:id/usuarios',
  requireCampusAdmin,
  requireCampusOwner,
  asyncHandler(adminController.listByCampus),
);

export default router;

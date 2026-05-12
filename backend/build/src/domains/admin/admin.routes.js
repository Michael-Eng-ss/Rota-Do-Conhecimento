"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../../controllers/AdminController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/**
 * Todas as rotas deste módulo exigem autenticação.
 * A tela de admin é acessada diretamente pela URL (/admin).
 * O back-end valida o role no JWT — o front-end NÃO precisa de lógica para "esconder" o botão.
 */
router.use(middlewares_1.requireAuth);
/**
 * POST /admin/admins
 * Cria um novo admin (SUPER_ADMIN pode criar ADMIN ou CAMPUS_ADMIN;
 * ADMIN pode criar apenas CAMPUS_ADMIN).
 */
router.post('/admins', middlewares_1.requireSuperAdmin, (0, middlewares_1.asyncHandler)(AdminController_1.adminController.createAdmin));
/**
 * PUT /admin/usuarios/:id/role
 * Promove/altera o role de um usuário.
 * Apenas SUPER_ADMIN pode promover.
 */
router.put('/usuarios/:id/role', middlewares_1.requireSuperAdmin, (0, middlewares_1.asyncHandler)(AdminController_1.adminController.promoteUser));
/**
 * GET /admin/usuarios
 * Lista todos os usuários.
 * Requer ADMIN ou SUPER_ADMIN.
 */
router.get('/usuarios', middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(AdminController_1.adminController.listAll));
/**
 * GET /admin/campus/:id/usuarios
 * Lista usuários de um campus específico.
 * CAMPUS_ADMIN só acessa o próprio campus.
 */
router.get('/campus/:id/usuarios', middlewares_1.requireCampusAdmin, middlewares_1.requireCampusOwner, (0, middlewares_1.asyncHandler)(AdminController_1.adminController.listByCampus));
exports.default = router;
//# sourceMappingURL=admin.routes.js.map
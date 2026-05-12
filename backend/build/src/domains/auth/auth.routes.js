"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../controllers/AuthController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/**
 * POST /auth
 * Login — retorna { token, role, campusId, user }.
 * O frontend usa `role` para redirecionar ao painel correto.
 * A tela de admin é acessada diretamente pela URL (sem botão no front).
 */
router.post('/', (0, middlewares_1.validateBody)({ email: 'string', senha: 'string' }), (0, middlewares_1.asyncHandler)(AuthController_1.authController.login));
/**
 * POST /auth/esqueci-senha
 * Inicia o fluxo de recuperação de senha por e-mail.
 */
router.post('/esqueci-senha', (0, middlewares_1.validateBody)({ email: 'string' }), (0, middlewares_1.asyncHandler)(AuthController_1.authController.forgotPassword));
/**
 * POST /auth/nova-senha
 * Conclui a redefinição de senha com o token recebido por e-mail.
 */
router.post('/nova-senha', (0, middlewares_1.validateBody)({ token: 'string', senha: 'string' }), (0, middlewares_1.asyncHandler)(AuthController_1.authController.resetPassword));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
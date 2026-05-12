"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../../controllers/UsuarioController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** POST / — cadastro de novo jogador (público). */
router.post('/', (0, middlewares_1.validateBody)({ nome: 'string', email: 'string', senha: 'string' }), (0, middlewares_1.asyncHandler)(UsuarioController_1.usuarioController.create));
/** GET /curso/:cursoId — lista usuários por curso (público). */
router.get('/curso/:cursoId', (0, middlewares_1.asyncHandler)(UsuarioController_1.usuarioController.findByCurso));
/** GET /:id — perfil de usuário (requer auth). */
router.get('/:id', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(UsuarioController_1.usuarioController.getById));
/** PUT /:id — atualizar perfil (requer auth; o próprio usuário ou admin). */
router.put('/:id', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(UsuarioController_1.usuarioController.update));
/** PUT /:id/senha — alterar senha (requer auth). */
router.put('/:id/senha', middlewares_1.requireAuth, (0, middlewares_1.validateBody)({ senha: 'string' }), (0, middlewares_1.asyncHandler)(UsuarioController_1.usuarioController.updatePassword));
/** PUT /:id/pontuacao — atualizar pontuação (requer auth). */
router.put('/:id/pontuacao', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(UsuarioController_1.usuarioController.updateScore));
exports.default = router;
//# sourceMappingURL=users.routes.js.map
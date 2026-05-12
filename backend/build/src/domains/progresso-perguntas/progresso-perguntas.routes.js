"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProgressoController_1 = require("../../controllers/ProgressoController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /progresso-perguntas/quiz/:quizId/usuario/:userId */
router.get('/quiz/:quizId/usuario/:userId', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(ProgressoController_1.progressoController.getByQuizAndUsuario));
/** GET /progresso-perguntas/categoria/:catId/quiz/:quizId/usuario/:userId */
router.get('/categoria/:catId/quiz/:quizId/usuario/:userId', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(ProgressoController_1.progressoController.getByCategQuizAndUsuario));
/** POST /progresso-perguntas — registrar (autenticado) */
router.post('/', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(ProgressoController_1.progressoController.create));
exports.default = router;
//# sourceMappingURL=progresso-perguntas.routes.js.map
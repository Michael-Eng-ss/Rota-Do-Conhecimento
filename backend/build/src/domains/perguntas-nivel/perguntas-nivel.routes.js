"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PerguntaNivelController_1 = require("../../controllers/PerguntaNivelController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /perguntas-nivel — lista todos (público) */
router.get('/', (0, middlewares_1.asyncHandler)(PerguntaNivelController_1.perguntaNivelController.getAll));
/** GET /perguntas-nivel/:id — detalhe (público) */
router.get('/:id', (0, middlewares_1.asyncHandler)(PerguntaNivelController_1.perguntaNivelController.getById));
/** POST /perguntas-nivel — criar (admin) */
router.post('/', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(PerguntaNivelController_1.perguntaNivelController.create));
/** PUT /perguntas-nivel/:id — editar (admin) */
router.put('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(PerguntaNivelController_1.perguntaNivelController.update));
/** DELETE /perguntas-nivel/:id — remover (admin) */
router.delete('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(PerguntaNivelController_1.perguntaNivelController.delete));
exports.default = router;
//# sourceMappingURL=perguntas-nivel.routes.js.map
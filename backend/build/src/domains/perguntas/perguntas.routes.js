"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PerguntaController_1 = require("../../controllers/PerguntaController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /perguntas/todas — lista todas as perguntas (público) */
router.get('/todas', (0, middlewares_1.asyncHandler)(PerguntaController_1.perguntaController.getAll));
/** GET /perguntas/completas/:categoriaId?active=false — com alternativas (público) */
router.get('/completas/:categoriaId', (0, middlewares_1.asyncHandler)(PerguntaController_1.perguntaController.getCompletas));
/** GET /perguntas/:id — detalhe (público) */
router.get('/:id', (0, middlewares_1.asyncHandler)(PerguntaController_1.perguntaController.getById));
/** POST /perguntas — criar (admin) */
router.post('/', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(PerguntaController_1.perguntaController.create));
/** PUT /perguntas/:id — editar (admin) */
router.put('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(PerguntaController_1.perguntaController.update));
/** DELETE /perguntas/:id — remover (admin) */
router.delete('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(PerguntaController_1.perguntaController.delete));
exports.default = router;
//# sourceMappingURL=perguntas.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AlternativaController_1 = require("../../controllers/AlternativaController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /alternativas/pergunta/:perguntaId — por pergunta (público) */
router.get('/pergunta/:perguntaId', (0, middlewares_1.asyncHandler)(AlternativaController_1.alternativaController.getByPergunta));
/** POST /alternativas — criar (admin) */
router.post('/', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(AlternativaController_1.alternativaController.create));
/** PUT /alternativas/:id — editar (admin) */
router.put('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(AlternativaController_1.alternativaController.update));
/** DELETE /alternativas/:id — remover (admin) */
router.delete('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(AlternativaController_1.alternativaController.delete));
exports.default = router;
//# sourceMappingURL=alternativas.routes.js.map
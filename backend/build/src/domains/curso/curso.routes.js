"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CursoController_1 = require("../../controllers/CursoController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /curso — lista todos (público) */
router.get('/', (0, middlewares_1.asyncHandler)(CursoController_1.cursoController.getAll));
/** GET /curso/:id — detalhe (público) */
router.get('/:id', (0, middlewares_1.asyncHandler)(CursoController_1.cursoController.getById));
/** POST /curso — criar (admin) */
router.post('/', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CursoController_1.cursoController.create));
/** PUT /curso/:id — editar (admin) */
router.put('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CursoController_1.cursoController.update));
/** DELETE /curso/:id — remover (admin) */
router.delete('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CursoController_1.cursoController.delete));
exports.default = router;
//# sourceMappingURL=curso.routes.js.map
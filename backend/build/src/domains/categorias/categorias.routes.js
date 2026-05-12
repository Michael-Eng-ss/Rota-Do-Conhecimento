"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoriaController_1 = require("../../controllers/CategoriaController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /categorias — lista todas (público) */
router.get('/', (0, middlewares_1.asyncHandler)(CategoriaController_1.categoriaController.getAll));
/** GET /categorias/curso/:cursoId — filtra por curso (público) */
router.get('/curso/:cursoId', (0, middlewares_1.asyncHandler)(CategoriaController_1.categoriaController.getByCurso));
/** GET /categorias/:id — detalhe (público) */
router.get('/:id', (0, middlewares_1.asyncHandler)(CategoriaController_1.categoriaController.getById));
/** POST /categorias — criar (admin) */
router.post('/', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CategoriaController_1.categoriaController.create));
/** PUT /categorias/:id — editar (admin) */
router.put('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CategoriaController_1.categoriaController.update));
/** DELETE /categorias/:id — remover (admin) */
router.delete('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CategoriaController_1.categoriaController.delete));
exports.default = router;
//# sourceMappingURL=categorias.routes.js.map
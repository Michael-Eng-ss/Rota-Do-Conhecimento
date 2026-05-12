"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CampusController_1 = require("../../controllers/CampusController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /campus — lista todos os campus (público). */
router.get('/', (0, middlewares_1.asyncHandler)(CampusController_1.campusController.getAll));
/** GET /campus/:id — detalhes de um campus (público). */
router.get('/:id', (0, middlewares_1.asyncHandler)(CampusController_1.campusController.getById));
/** POST /campus — criar campus (apenas ADMIN+). */
router.post('/', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CampusController_1.campusController.create));
/** PUT /campus/:id — editar campus (apenas ADMIN+). */
router.put('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CampusController_1.campusController.update));
/** DELETE /campus/:id — remover campus (apenas ADMIN+). */
router.delete('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(CampusController_1.campusController.delete));
exports.default = router;
//# sourceMappingURL=campus.routes.js.map
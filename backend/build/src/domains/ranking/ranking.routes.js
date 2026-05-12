"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RankingController_1 = require("../../controllers/RankingController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /ranking?limit=100 — ranking global. */
router.get('/', (0, middlewares_1.asyncHandler)(RankingController_1.rankingController.getGlobal));
/** GET /ranking/curso/:cursoId?limit=50 */
router.get('/curso/:cursoId', (0, middlewares_1.asyncHandler)(RankingController_1.rankingController.getByCurso));
/** GET /ranking/campus/:campusId?limit=50 */
router.get('/campus/:campusId', (0, middlewares_1.asyncHandler)(RankingController_1.rankingController.getByCampus));
exports.default = router;
//# sourceMappingURL=ranking.routes.js.map
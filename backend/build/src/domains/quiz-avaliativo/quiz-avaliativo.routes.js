"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuizAvaliativoController_1 = require("../../controllers/QuizAvaliativoController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /quiz-avaliativo/usuario/:userId */
router.get('/usuario/:userId', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(QuizAvaliativoController_1.quizAvaliativoController.getByUsuario));
/** GET /quiz-avaliativo/quiz/:quizId */
router.get('/quiz/:quizId', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(QuizAvaliativoController_1.quizAvaliativoController.getByQuiz));
/** POST /quiz-avaliativo — registrar resultado */
router.post('/', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(QuizAvaliativoController_1.quizAvaliativoController.create));
/** DELETE /quiz-avaliativo/:id */
router.delete('/:id', middlewares_1.requireAuth, (0, middlewares_1.asyncHandler)(QuizAvaliativoController_1.quizAvaliativoController.delete));
exports.default = router;
//# sourceMappingURL=quiz-avaliativo.routes.js.map
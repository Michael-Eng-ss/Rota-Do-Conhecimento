"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuizController_1 = require("../../controllers/QuizController");
const middlewares_1 = require("../../middlewares");
const router = (0, express_1.Router)();
/** GET /quiz — lista todos (público) */
router.get('/', (0, middlewares_1.asyncHandler)(QuizController_1.quizController.getAll));
/** GET /quiz/curso/:cursoId — filtra por curso (público) */
router.get('/curso/:cursoId', (0, middlewares_1.asyncHandler)(QuizController_1.quizController.getByCurso));
/** GET /quiz/:id — detalhe (público) */
router.get('/:id', (0, middlewares_1.asyncHandler)(QuizController_1.quizController.getById));
/** POST /quiz — criar (admin) */
router.post('/', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(QuizController_1.quizController.create));
/** PUT /quiz/:id — editar (admin) */
router.put('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(QuizController_1.quizController.update));
/** DELETE /quiz/:id — remover (admin) */
router.delete('/:id', middlewares_1.requireAuth, middlewares_1.requireAdmin, (0, middlewares_1.asyncHandler)(QuizController_1.quizController.delete));
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map
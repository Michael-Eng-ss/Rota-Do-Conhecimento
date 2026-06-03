import { Router } from 'express';
import { quizAvaliativoController } from '../controllers/QuizAvaliativoController';
import { asyncHandler, requireAuth } from '../middlewares';

const router = Router();

/** GET /quiz-avaliativo/usuario/:userId */
router.get('/usuario/:userId', requireAuth, asyncHandler(quizAvaliativoController.getByUsuario));

/** GET /quiz-avaliativo/quiz/:quizId */
router.get('/quiz/:quizId', requireAuth, asyncHandler(quizAvaliativoController.getByQuiz));

/** POST /quiz-avaliativo — registrar resultado */
router.post('/', requireAuth, asyncHandler(quizAvaliativoController.create));

/** DELETE /quiz-avaliativo/:id */
router.delete('/:id', requireAuth, asyncHandler(quizAvaliativoController.delete));

export default router;

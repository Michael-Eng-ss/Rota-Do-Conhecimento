import { Router } from 'express';
import { quizController } from '../controllers/QuizController';
import { asyncHandler, requireAuth, requireAdmin } from '../middlewares';

const router = Router();

/** GET /quiz — lista todos (público) */
router.get('/', asyncHandler(quizController.getAll));

/** GET /quiz/curso/:cursoId — filtra por curso (público) */
router.get('/curso/:cursoId', asyncHandler(quizController.getByCurso));

/** GET /quiz/:id — detalhe (público) */
router.get('/:id', asyncHandler(quizController.getById));

/** POST /quiz — criar (admin) */
router.post('/', requireAuth, requireAdmin, asyncHandler(quizController.create));

/** PUT /quiz/:id — editar (admin) */
router.put('/:id', requireAuth, requireAdmin, asyncHandler(quizController.update));

/** DELETE /quiz/:id — remover (admin) */
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(quizController.delete));

export default router;

import { Router } from 'express';
import { rankingController } from '../../controllers/RankingController';
import { asyncHandler } from '../../middlewares';

const router = Router();

/** GET /ranking?limit=100 — ranking global. */
router.get('/', asyncHandler(rankingController.getGlobal));

/** GET /ranking/curso/:cursoId?limit=50 */
router.get('/curso/:cursoId', asyncHandler(rankingController.getByCurso));

/** GET /ranking/campus/:campusId?limit=50 */
router.get('/campus/:campusId', asyncHandler(rankingController.getByCampus));

export default router;

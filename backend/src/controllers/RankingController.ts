import { Request, Response } from 'express';
import { RankingService } from '../services/RankingService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class RankingController {
  private service: RankingService;

  constructor() {
    this.service = new RankingService(getDataSource());
  }

  /** GET /ranking?limit=100 */
  getGlobal = async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string || '100');
    const ranking = await this.service.getGlobalRanking(limit);
    res.json(ranking);
  };

  /** GET /ranking/curso/:cursoId?limit=50 */
  getByCurso = async (req: Request, res: Response): Promise<void> => {
    const cursoId = parseInt(String(req.params.cursoId));
    if (isNaN(cursoId)) throw AppError.badRequest('cursoId inválido');
    const limit   = parseInt(String(req.query.limit ?? '50'));
    const ranking = await this.service.getRankingByCurso(cursoId, limit);
    res.json(ranking);
  };

  /** GET /ranking/campus/:campusId?limit=50 */
  getByCampus = async (req: Request, res: Response): Promise<void> => {
    const campusId = parseInt(String(req.params.campusId));
    if (isNaN(campusId)) throw AppError.badRequest('campusId inválido');
    const limit    = parseInt(String(req.query.limit ?? '50'));
    const ranking  = await this.service.getRankingByCampus(campusId, limit);
    res.json(ranking);
  };
}

export const rankingController = new RankingController();

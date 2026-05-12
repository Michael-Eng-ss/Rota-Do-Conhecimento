import { Request, Response } from 'express';
import { QuizAvaliativoService } from '../services/QuizAvaliativoService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class QuizAvaliativoController {
  private service: QuizAvaliativoService;

  constructor() {
    this.service = new QuizAvaliativoService(getDataSource());
  }

  /** GET /quiz-avaliativo/usuario/:userId */
  getByUsuario = async (req: Request, res: Response): Promise<void> => {
    const usuarioid = parseInt(String(req.params.userId));
    if (isNaN(usuarioid)) throw AppError.badRequest('ID inválido');
    const items = await this.service.getByUsuario(usuarioid);
    res.json(items);
  };

  /** GET /quiz-avaliativo/quiz/:quizId */
  getByQuiz = async (req: Request, res: Response): Promise<void> => {
    const quizid = parseInt(String(req.params.quizId));
    if (isNaN(quizid)) throw AppError.badRequest('ID inválido');
    const items = await this.service.getByQuiz(quizid);
    res.json(items);
  };

  /** POST /quiz-avaliativo */
  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  };

  /** DELETE /quiz-avaliativo/:id */
  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const result = await this.service.delete(id);
    res.json(result);
  };
}

export const quizAvaliativoController = new QuizAvaliativoController();

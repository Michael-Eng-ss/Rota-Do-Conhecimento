import { Request, Response } from 'express';
import { QuizService } from '../services/QuizService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class QuizController {
  private service: QuizService;

  constructor() {
    this.service = new QuizService(getDataSource());
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.getAll();
    res.json(items);
  };

  getByCurso = async (req: Request, res: Response): Promise<void> => {
    const cursoid = parseInt(String(req.params.cursoId));
    if (isNaN(cursoid)) throw AppError.badRequest('ID de curso inválido');
    const items = await this.service.getByCurso(cursoid);
    res.json(items);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const item = await this.service.getById(id);
    res.json(item);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const item = await this.service.update(id, req.body);
    res.json(item);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const result = await this.service.delete(id);
    res.json(result);
  };
}

export const quizController = new QuizController();

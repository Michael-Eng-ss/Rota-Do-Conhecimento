import { Request, Response } from 'express';
import { PerguntaNivelService } from '../services/PerguntaNivelService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class PerguntaNivelController {
  private service: PerguntaNivelService;

  constructor() {
    this.service = new PerguntaNivelService(getDataSource());
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.getAll();
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

export const perguntaNivelController = new PerguntaNivelController();

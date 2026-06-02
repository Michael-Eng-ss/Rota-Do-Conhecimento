import { Request, Response } from 'express';
import { AlternativaService } from '../services/AlternativaService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class AlternativaController {
  private service: AlternativaService;

  constructor() {
    this.service = new AlternativaService(getDataSource());
  }

  /** GET /alternativas/pergunta/:perguntaId */
  getByPergunta = async (req: Request, res: Response): Promise<void> => {
    const perguntasid = parseInt(String(req.params.perguntaId));
    if (isNaN(perguntasid)) throw AppError.badRequest('ID de pergunta inválido');
    const items = await this.service.getByPergunta(perguntasid);
    res.json(items);
  };

  /** POST /alternativas */
  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  };

  /** PUT /alternativas/:id */
  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const item = await this.service.update(id, req.body);
    res.json(item);
  };

  /** DELETE /alternativas/:id */
  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const result = await this.service.delete(id);
    res.json(result);
  };
}

export const alternativaController = new AlternativaController();

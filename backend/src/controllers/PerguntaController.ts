import { Request, Response } from 'express';
import { PerguntaService } from '../services/PerguntaService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class PerguntaController {
  private service: PerguntaService;

  constructor() {
    this.service = new PerguntaService(getDataSource());
  }

  /** GET /perguntas/todas */
  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.getAll();
    res.json(items);
  };

  /** GET /perguntas/completas/:categoriaId?active=false */
  getCompletas = async (req: Request, res: Response): Promise<void> => {
    const categoriasid = parseInt(String(req.params.categoriaId));
    if (isNaN(categoriasid)) throw AppError.badRequest('ID de categoria inválido');
    const activeOnly = req.query.active !== 'false';
    const items = await this.service.getCompletas(categoriasid, activeOnly);
    res.json(items);
  };

  /** GET /perguntas/:id */
  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const item = await this.service.getById(id);
    res.json(item);
  };

  /** POST /perguntas */
  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  };

  /** PUT /perguntas/:id */
  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const item = await this.service.update(id, req.body);
    res.json(item);
  };

  /** DELETE /perguntas/:id */
  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const result = await this.service.delete(id);
    res.json(result);
  };
}

export const perguntaController = new PerguntaController();

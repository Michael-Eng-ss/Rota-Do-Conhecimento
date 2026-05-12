import { Request, Response } from 'express';
import { CampusService } from '../services/CampusService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class CampusController {
  private service: CampusService;

  constructor() {
    this.service = new CampusService(getDataSource());
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.getAll();
    res.json(items);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const campus = await this.service.getById(id);
    res.json(campus);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { nome } = req.body as { nome: string };
    if (!nome?.trim()) throw AppError.badRequest('Nome do campus é obrigatório');
    const campus = await this.service.create(nome.trim());
    res.status(201).json(campus);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id   = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const { nome } = req.body as { nome: string };
    if (!nome?.trim()) throw AppError.badRequest('Nome do campus é obrigatório');
    const campus = await this.service.update(id, nome.trim());
    res.json(campus);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const result = await this.service.delete(id);
    res.json(result);
  };
}

export const campusController = new CampusController();

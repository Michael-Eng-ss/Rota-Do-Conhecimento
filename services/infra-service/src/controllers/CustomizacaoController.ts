import { Request, Response } from 'express';
import { CustomizacaoService } from '../services/CustomizacaoService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class CustomizacaoController {
  private service: CustomizacaoService;

  constructor() {
    this.service = new CustomizacaoService(getDataSource());
  }

  /** GET /customizacoes — lista todas */
  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.getAll();
    res.json(items);
  };

  /** GET /customizacoes/ativas — apenas ativas */
  getActive = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.getActive();
    res.json(items);
  };

  /** GET /customizacoes/tipo/:tipo — por tipo */
  getByTipo = async (req: Request, res: Response): Promise<void> => {
    const items = await this.service.getByTipo(String(req.params.tipo));
    res.json(items);
  };

  /** GET /customizacoes/:id — detalhe */
  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const item = await this.service.getById(id);
    res.json(item);
  };

  /** POST /customizacoes — criar */
  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  };

  /** PUT /customizacoes/:id — editar */
  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const item = await this.service.update(id, req.body);
    res.json(item);
  };

  /** PATCH /customizacoes/:id/toggle — ativar/desativar */
  toggleActive = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const { ativo } = req.body;
    if (typeof ativo !== 'boolean') throw AppError.badRequest('Campo "ativo" (boolean) é obrigatório');
    const item = await this.service.toggleActive(id, ativo);
    res.json(item);
  };

  /** DELETE /customizacoes/:id — remover */
  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const result = await this.service.delete(id);
    res.json(result);
  };
}

export const customizacaoController = new CustomizacaoController();

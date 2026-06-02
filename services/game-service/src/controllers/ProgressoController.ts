import { Request, Response } from 'express';
import { ProgressoService } from '../services/ProgressoService';
import { AppError } from '../shared/AppError';
import { getDataSource } from '../config/data-source';

export class ProgressoController {
  private service: ProgressoService;

  constructor() {
    this.service = new ProgressoService(getDataSource());
  }

  /** GET /progresso-perguntas/quiz/:quizId/usuario/:userId */
  getByQuizAndUsuario = async (req: Request, res: Response): Promise<void> => {
    const quizid    = parseInt(String(req.params.quizId));
    const usuariosid = parseInt(String(req.params.userId));
    if (isNaN(quizid) || isNaN(usuariosid)) throw AppError.badRequest('IDs inválidos');
    const items = await this.service.getByQuizAndUsuario(quizid, usuariosid);
    res.json(items);
  };

  /** GET /progresso-perguntas/categoria/:catId/quiz/:quizId/usuario/:userId */
  getByCategQuizAndUsuario = async (req: Request, res: Response): Promise<void> => {
    const categoriasid = parseInt(String(req.params.catId));
    const quizid       = parseInt(String(req.params.quizId));
    const usuariosid   = parseInt(String(req.params.userId));
    if (isNaN(categoriasid) || isNaN(quizid) || isNaN(usuariosid))
      throw AppError.badRequest('IDs inválidos');
    const items = await this.service.getByCategQuizAndUsuario(categoriasid, quizid, usuariosid);
    res.json(items);
  };

  /** POST /progresso-perguntas */
  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  };
}

export const progressoController = new ProgressoController();

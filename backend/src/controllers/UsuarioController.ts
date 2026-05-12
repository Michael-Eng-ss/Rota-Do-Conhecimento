import { Request, Response } from 'express';
import { UsuarioService } from '@/services/UsuarioService';
import { AppError } from '@/shared/AppError';
import { Role } from '@/shared/constants';
import { getDataSource } from '@/config/data-source';
import { AuthRequest } from '@/middlewares/auth.middleware';

export class UsuarioController {
  private service: UsuarioService;

  constructor() {
    this.service = new UsuarioService(getDataSource());
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) throw AppError.badRequest('ID inválido');
    const user = await this.service.getById(id);
    res.json(user);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.create(req.body);
    res.status(201).json(user);
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) throw AppError.badRequest('ID inválido');

    if (!UsuarioService.canEditUser(req.user!.id, req.user!.role, targetId)) {
      throw AppError.forbidden('Sem permissão para editar este perfil');
    }

    const user = await this.service.update(targetId, req.body);
    res.json(user);
  };

  updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) throw AppError.badRequest('ID inválido');

    if (!UsuarioService.canEditUser(req.user!.id, req.user!.role, targetId)) {
      throw AppError.forbidden('Sem permissão para alterar esta senha');
    }

    const result = await this.service.updatePassword(targetId, req.body.senha);
    res.json(result);
  };

  updateScore = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) throw AppError.badRequest('ID inválido');

    if (!UsuarioService.canEditUser(req.user!.id, req.user!.role, targetId)) {
      throw AppError.forbidden('Sem permissão para atualizar esta pontuação');
    }

    const delta = Number(req.body.pontuacao);
    if (isNaN(delta)) throw AppError.badRequest('Pontuação inválida');

    const user = await this.service.updateScore(targetId, delta);
    res.json(user);
  };

  findByCurso = async (req: Request, res: Response): Promise<void> => {
    const cursoId = parseInt(String(req.params.cursoId));
    const skip    = parseInt(String(req.query.skip ?? '0'));
    const take    = parseInt(String(req.query.take ?? '20'));
    if (isNaN(cursoId)) throw AppError.badRequest('cursoId inválido');

    const users = await this.service.findByCurso(cursoId, skip, take);
    res.json(users);
  };
}

export const usuarioController = new UsuarioController();

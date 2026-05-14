import { Request, Response } from 'express';
import { AdminService } from '@/services/AdminService';
import { AppError } from '@/shared/AppError';
import { Role } from '@/shared/constants';
import { getDataSource } from '@/config/data-source';
import { AuthRequest } from '@/middlewares/auth.middleware';

export class AdminController {
  private service: AdminService;

  constructor() {
    this.service = new AdminService(getDataSource());
  }

  /** POST /admin/admins — cria novo admin (SUPER_ADMIN only). */
  createAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await this.service.createAdmin(req.body, req.user!);
    res.status(201).json(user);
  };

  /** PUT /admin/usuarios/:id/role — promove usuário (SUPER_ADMIN only). */
  promoteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) throw AppError.badRequest('ID inválido');

    const { role } = req.body as { role: Role };
    if (!Object.values(Role).includes(role)) throw AppError.badRequest('Role inválida');

    const result = await this.service.promoteUser(targetId, role, req.user!);
    res.json(result);
  };

  /** GET /admin/usuarios — lista todos os usuários (incluindo inativos). */
  listAll = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.service.listAll();
    res.json(users);
  };

  /** GET /admin/usuarios/:id — retorna perfil completo de um usuário. */
  getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) throw AppError.badRequest('ID inválido');
    const user = await this.service.getUserById(targetId);
    res.json(user);
  };

  /** PUT /admin/usuarios/:id — edita dados do usuário (nome, email, etc.). */
  updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) throw AppError.badRequest('ID inválido');
    const user = await this.service.updateUser(targetId, req.body, req.user!);
    res.json(user);
  };

  /** PUT /admin/usuarios/:id/status — ativa ou desativa um usuário. */
  toggleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetId = parseInt(String(req.params.id));
    if (isNaN(targetId)) throw AppError.badRequest('ID inválido');

    const { status } = req.body as { status: boolean };
    if (typeof status !== 'boolean') throw AppError.badRequest('Campo "status" deve ser booleano');

    const result = await this.service.toggleStatus(targetId, status, req.user!);
    res.json(result);
  };

  /** GET /admin/campus/:id/usuarios — lista usuários do campus. */
  listByCampus = async (req: AuthRequest, res: Response): Promise<void> => {
    const campusId = parseInt(String(req.params.id));
    if (isNaN(campusId)) throw AppError.badRequest('campusId inválido');
    const users = await this.service.listByCampus(campusId);
    res.json(users);
  };
}

export const adminController = new AdminController();

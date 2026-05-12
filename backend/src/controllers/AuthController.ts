import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { getDataSource } from '../config/data-source';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService(getDataSource());
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body as { email: string; senha: string };
    const result = await this.service.login(email, senha);
    res.json(result);
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as { email: string };
    const result = await this.service.forgotPassword(email);
    res.json(result);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, senha } = req.body as { token: string; senha: string };
    const result = await this.service.resetPassword(token, senha);
    res.json(result);
  };
}

export const authController = new AuthController();

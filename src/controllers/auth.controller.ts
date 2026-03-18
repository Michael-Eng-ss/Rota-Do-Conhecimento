import { login } from '@/models/services/auth.service';
import { setToken, setSavedUser, clearAuth, getToken, getSavedUser } from '@/lib/api-client';
import { UsuarioController } from './usuario.controller';
import { Usuario } from '@/entities';
import type { LoginResponse } from '@/models/types';

export class AuthController {
  private usuarioCtrl = new UsuarioController();

  /** Realiza login, armazena token e retorna dados do usuário */
  async login(email: string, senha: string): Promise<{ user: Usuario; token: string; role: number }> {
    if (!email?.trim()) throw new Error('Email é obrigatório');
    if (!senha?.trim()) throw new Error('Senha é obrigatória');

    const result: LoginResponse = await login({ email: email.trim(), senha });
    setToken(result.token);

    const user = await this.usuarioCtrl.getById(result.id);
    setSavedUser(user.toApi() as any);

    return { user, token: result.token, role: result.role };
  }

  /** Verifica se é admin (role === 1) */
  async loginAdmin(email: string, senha: string): Promise<{ user: Usuario; token: string }> {
    const result = await this.login(email, senha);
    if (!result.user.isAdmin) {
      this.logout();
      throw new Error('Acesso negado. Apenas administradores podem acessar.');
    }
    return result;
  }

  /** Encerra a sessão */
  logout(): void {
    clearAuth();
  }

  /** Verifica se existe sessão ativa */
  isAuthenticated(): boolean {
    return !!getToken();
  }

  /** Retorna usuário salvo localmente */
  getCurrentUser(): Usuario | null {
    const saved = getSavedUser();
    return saved ? Usuario.fromApi(saved) : null;
  }
}

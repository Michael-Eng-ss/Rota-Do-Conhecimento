import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { LogRepository } from '@/repositories/LogRepository';
import { EmailTokenRepository } from '@/repositories/EmailTokenRepository';
import { AppError } from '@/shared/AppError';
import { Role, EmailTokenType, TOKEN_TTL_MINUTES, JWT_EXPIRES_IN } from '@/shared/constants';
import { EmailService } from '@/services/EmailService';
import { Usuario } from '@/entities/Usuario';
import { JWTPayload } from '@/shared/types';

export type { JWTPayload };

const JWT_SECRET = process.env.JWT_SECRET || '3099708496ef917af0b641323143ba7a';
const BCRYPT_ROUNDS = 12;

export interface LoginResult {
  token: string;
  role: Role;
  campusId: number | null;
  user: Omit<Usuario, 'senha'>;
}

export class AuthService {
  private usuarioRepo: UsuarioRepository;
  private logRepo: LogRepository;
  private emailTokenRepo: EmailTokenRepository;
  private emailService: EmailService;

  constructor(dataSource: DataSource) {
    this.usuarioRepo    = new UsuarioRepository(dataSource);
    this.logRepo        = new LogRepository(dataSource);
    this.emailTokenRepo = new EmailTokenRepository(dataSource);
    this.emailService   = new EmailService();
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  async login(email: string, senha: string): Promise<LoginResult> {
    const user = await this.usuarioRepo.findByEmailWithPassword(email);
    if (!user) throw AppError.unauthorized('Email e/ou Senha Incorretos');
    if (!user.status) throw AppError.forbidden('Conta desativada. Entre em contato com o suporte.');

    if (!user.emailVerified && user.role === Role.PLAYER) {
      throw AppError.forbidden('E-mail não verificado. Por favor, verifique sua caixa de entrada antes de fazer login.');
    }

    const valid = await this.verifyPassword(senha, user.senha);
    if (!valid) throw AppError.unauthorized('Email e/ou Senha Incorretos');

    // Re-hash progressivo: se a senha ainda estava em SHA-256, atualiza para bcrypt
    if (this.isSha256Hash(user.senha)) {
      const newHash = await bcrypt.hash(senha, BCRYPT_ROUNDS);
      await this.usuarioRepo.updatePassword(user.id, newHash);
    }

    const payload: JWTPayload = {
      id: user.id,
      name: user.nome,
      role: user.role,
      campusId: user.campusId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    await this.logRepo.create(user.id, 'Login successfully');

    const { senha: _removed, ...safeUser } = user as Record<string, unknown>;
    void _removed;

    return {
      token,
      role: user.role,
      campusId: user.campusId,
      user: safeUser as Omit<Usuario, 'senha'>,
    };
  }

  // ── Recuperação de Senha ──────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usuarioRepo.findByEmailWithPassword(email);
    // Resposta genérica para não revelar existência do e-mail
    if (!user) return { message: 'Se o e-mail existir, você receberá as instruções.' };

    const token = await this.emailTokenRepo.create(
      user.id,
      EmailTokenType.RESET_PASSWORD,
      TOKEN_TTL_MINUTES.RESET_PASSWORD,
    );

    await this.emailService.sendPasswordReset(email, user.nome, token);
    return { message: 'Se o e-mail existir, você receberá as instruções.' };
  }

  async resetPassword(token: string, novaSenha: string): Promise<{ message: string }> {
    const record = await this.emailTokenRepo.findValid(token, EmailTokenType.RESET_PASSWORD);
    if (!record) throw AppError.badRequest('Link inválido ou expirado');

    const hashed = await bcrypt.hash(novaSenha, BCRYPT_ROUNDS);
    await this.usuarioRepo.updatePassword(record.usuarioId, hashed);
    await this.emailTokenRepo.markUsed(token);

    return { message: 'Senha atualizada com sucesso!' };
  }

  // ── Verificação de E-mail ─────────────────────────────────────────────────

  async verifyEmail(token: string): Promise<{ message: string }> {
    const record = await this.emailTokenRepo.findValid(token, EmailTokenType.EMAIL_VERIFY);
    if (!record) throw AppError.badRequest('Link de verificação inválido ou expirado.');

    await this.usuarioRepo.update(record.usuarioId, { emailVerified: true } as Partial<Usuario>);
    await this.emailTokenRepo.markUsed(token);

    return { message: 'E-mail verificado com sucesso!' };
  }

  // ── Helpers privados ──────────────────────────────────────────────────────

  /**
   * Verifica senha suportando tanto bcrypt (novo) quanto SHA-256 (legado).
   * Permite migração progressiva sem resetar senhas de todos os usuários.
   */
  private async verifyPassword(plain: string, stored: string): Promise<boolean> {
    if (this.isSha256Hash(stored)) {
      // Fallback legado: SHA-256
      const sha = crypto.createHash('sha256').update(plain).digest('hex');
      return sha === stored;
    }
    // Verificação bcrypt padrão
    return bcrypt.compare(plain, stored);
  }

  /** Detecta se o hash é SHA-256 (64 chars hex, sem $2b$ prefix). */
  private isSha256Hash(hash: string): boolean {
    return /^[a-f0-9]{64}$/.test(hash);
  }

  /** Verifica e decodifica um JWT. */
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  }
}

import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { CampusRepository } from '../repositories/CampusRepository';
import { AppError } from '../shared/AppError';
import { Role, ROLE_HIERARCHY, EmailTokenType, TOKEN_TTL_MINUTES } from '../shared/constants';
import { Usuario } from '../entities/Usuario';
import { EmailTokenRepository } from '../repositories/EmailTokenRepository';
import { EmailService } from './EmailService';

const BCRYPT_ROUNDS = 12;

export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  datanascimento?: string;
  uf?: string;
  cidade?: string;
  turma?: string;
  periodo?: number;
  cursoId?: number;
  campusId?: number;
}

export interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  datanascimento?: string;
  uf?: string;
  cidade?: string;
  turma?: string;
  periodo?: number;
  foto?: string;
  cursoId?: number;
  campusId?: number;
}

export class UsuarioService {
  private usuarioRepo: UsuarioRepository;
  private campusRepo: CampusRepository;
  private emailTokenRepo: EmailTokenRepository;
  private emailService: EmailService;

  constructor(dataSource: DataSource) {
    this.usuarioRepo = new UsuarioRepository(dataSource);
    this.campusRepo  = new CampusRepository(dataSource);
    this.emailTokenRepo = new EmailTokenRepository(dataSource);
    this.emailService = new EmailService();
  }

  async getById(id: number): Promise<Omit<Usuario, 'senha'>> {
    const user = await this.usuarioRepo.findByIdWithRelations(id);
    if (!user) throw AppError.notFound('Usuário não encontrado');
    const { senha: _, ...safe } = user as Record<string, unknown>;
    void _;
    return safe as Omit<Usuario, 'senha'>;
  }

  async create(data: CreateUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    if (await this.usuarioRepo.existsByEmail(data.email)) {
      throw AppError.conflict('E-mail já cadastrado');
    }

    if (data.campusId) {
      const campus = await this.campusRepo.findById(data.campusId);
      if (!campus) throw AppError.badRequest('Campus não encontrado');
    }

    const senha = await bcrypt.hash(data.senha, BCRYPT_ROUNDS);
    const user  = await this.usuarioRepo.create({
      nome:           data.nome,
      email:          data.email,
      senha,
      role:           Role.PLAYER,
      pontuacao:      0,
      status:         true,
      telefone:       data.telefone,
      datanascimento: data.datanascimento ? new Date(data.datanascimento) : null,
      uf:             data.uf,
      cidade:         data.cidade,
      turma:          data.turma,
      periodo:        data.periodo,
      cursoId:        data.cursoId,
      campusId:       data.campusId,
    });

    try {
      const token = await this.emailTokenRepo.create(
        user.id,
        EmailTokenType.EMAIL_VERIFY,
        TOKEN_TTL_MINUTES.EMAIL_VERIFY
      );
      await this.emailService.sendEmailVerification(user.email, user.nome, token);
    } catch (err) {
      console.error('[UsuarioService] Erro ao enviar e-mail de verificação no cadastro:', err);
      // Não joga o erro para não quebrar a criação do usuário, ele pode pedir reenvio depois.
    }

    const { senha: _, ...safe } = user as Record<string, unknown>;
    void _;
    return safe as Omit<Usuario, 'senha'>;
  }

  async update(id: number, data: UpdateUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    const user = await this.usuarioRepo.findById(id);
    if (!user) throw AppError.notFound('Usuário não encontrado');

    if (data.campusId && data.campusId !== user.campusId) {
      const campus = await this.campusRepo.findById(data.campusId);
      if (!campus) throw AppError.badRequest('Campus não encontrado');
    }

    const updated = await this.usuarioRepo.update(id, data as Partial<Usuario>);
    if (!updated) throw AppError.notFound('Usuário não encontrado');

    const { senha: _, ...safe } = updated as Record<string, unknown>;
    void _;
    return safe as Omit<Usuario, 'senha'>;
  }

  async updatePassword(id: number, novaSenha: string): Promise<{ message: string }> {
    const exists = await this.usuarioRepo.findById(id);
    if (!exists) throw AppError.notFound('Usuário não encontrado');

    const hashed = await bcrypt.hash(novaSenha, BCRYPT_ROUNDS);
    await this.usuarioRepo.updatePassword(id, hashed);
    return { message: 'Senha atualizada com sucesso' };
  }

  async updateScore(id: number, delta: number): Promise<Omit<Usuario, 'senha'>> {
    const user = await this.usuarioRepo.findById(id);
    if (!user) throw AppError.notFound('Usuário não encontrado');

    const updated = await this.usuarioRepo.updateScore(id, delta);
    if (!updated) throw AppError.notFound('Usuário não encontrado');

    const { senha: _, ...safe } = updated as Record<string, unknown>;
    void _;
    return safe as Omit<Usuario, 'senha'>;
  }

  async deactivate(id: number): Promise<{ message: string }> {
    const ok = await this.usuarioRepo.deactivate(id);
    if (!ok) throw AppError.notFound('Usuário não encontrado');
    return { message: 'Usuário desativado com sucesso' };
  }

  async findByCurso(cursoId: number, skip = 0, take = 20): Promise<Omit<Usuario, 'senha'>[]> {
    const users = await this.usuarioRepo.findByCurso(cursoId, skip, take);
    return users.map((u) => {
      const { senha: _, ...safe } = u as Record<string, unknown>;
      void _;
      return safe as Omit<Usuario, 'senha'>;
    });
  }

  /** Verifica se o requester tem permissão para editar o target. */
  static canEditUser(requesterId: number, requesterRole: Role, targetId: number): boolean {
    if (requesterId === targetId) return true; // próprio usuário
    return ROLE_HIERARCHY[requesterRole] >= ROLE_HIERARCHY[Role.ADMIN];
  }
}

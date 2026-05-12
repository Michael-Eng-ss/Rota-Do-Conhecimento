import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { CampusRepository } from '../repositories/CampusRepository';
import { AppError } from '../shared/AppError';
import { Role, ROLE_HIERARCHY } from '../shared/constants';
import { JWTPayload } from './AuthService';
import { Usuario } from '../entities/Usuario';

const BCRYPT_ROUNDS = 12;

export interface CreateAdminDTO {
  nome: string;
  email: string;
  senha: string;
  role: Role.ADMIN | Role.CAMPUS_ADMIN | Role.SUPER_ADMIN;
  campusId?: number;
  cursoId?: number;
}

export class AdminService {
  private usuarioRepo: UsuarioRepository;
  private campusRepo: CampusRepository;

  constructor(dataSource: DataSource) {
    this.usuarioRepo = new UsuarioRepository(dataSource);
    this.campusRepo  = new CampusRepository(dataSource);
  }

  /**
   * Cria um novo admin.
   * Regras:
   * - Apenas SUPER_ADMIN pode criar outro SUPER_ADMIN ou ADMIN.
   * - SUPER_ADMIN e ADMIN podem criar CAMPUS_ADMIN.
   * - CAMPUS_ADMIN requer campusId.
   */
  async createAdmin(data: CreateAdminDTO, requester: JWTPayload): Promise<Omit<Usuario, 'senha'>> {
    this.assertCanCreateRole(data.role, requester);

    if (await this.usuarioRepo.existsByEmail(data.email)) {
      throw AppError.conflict('E-mail já cadastrado');
    }

    if (data.role === Role.CAMPUS_ADMIN) {
      if (!data.campusId) throw AppError.badRequest('campus_admin requer campusId');
      const campus = await this.campusRepo.findById(data.campusId);
      if (!campus) throw AppError.badRequest('Campus não encontrado');
    }

    const senha = await bcrypt.hash(data.senha, BCRYPT_ROUNDS);
    const user  = await this.usuarioRepo.create({
      nome:     data.nome,
      email:    data.email,
      senha,
      role:     data.role,
      campusId: data.campusId ?? null,
      cursoId:  data.cursoId  ?? null,
      pontuacao: 0,
      status:   true,
    });

    const { senha: _, ...safe } = user as Record<string, unknown>;
    void _;
    return safe as Omit<Usuario, 'senha'>;
  }

  /** Promove um usuário existente para um novo role. */
  async promoteUser(
    targetId: number,
    newRole: Role,
    requester: JWTPayload,
  ): Promise<{ message: string }> {
    this.assertCanCreateRole(newRole, requester);

    const target = await this.usuarioRepo.findById(targetId);
    if (!target) throw AppError.notFound('Usuário não encontrado');

    // Não permite rebaixar alguém com role >= ao do requester
    if (ROLE_HIERARCHY[target.role] >= ROLE_HIERARCHY[requester.role]) {
      throw AppError.forbidden('Não é possível alterar o role deste usuário');
    }

    await this.usuarioRepo.updateRole(targetId, newRole);
    return { message: `Usuário promovido para ${newRole} com sucesso` };
  }

  /** Lista todos os usuários (admin e players). */
  async listAll(): Promise<Omit<Usuario, 'senha'>[]> {
    const users = await this.usuarioRepo.findAll();
    return users.map((u) => {
      const { senha: _, ...safe } = u as Record<string, unknown>;
      void _;
      return safe as Omit<Usuario, 'senha'>;
    });
  }

  /** Lista usuários de um campus (para campus_admin). */
  async listByCampus(campusId: number): Promise<Omit<Usuario, 'senha'>[]> {
    const users = await this.usuarioRepo.findByCampus(campusId);
    return users.map((u) => {
      const { senha: _, ...safe } = u as Record<string, unknown>;
      void _;
      return safe as Omit<Usuario, 'senha'>;
    });
  }

  // ── Helpers privados ──────────────────────────────────────────────────────

  private assertCanCreateRole(targetRole: Role, requester: JWTPayload): void {
    const myLevel     = ROLE_HIERARCHY[requester.role];
    const targetLevel = ROLE_HIERARCHY[targetRole];

    // Só pode criar roles MENORES que o próprio
    if (targetLevel >= myLevel) {
      throw AppError.forbidden(
        'Você não possui permissão para criar um usuário com este nível de acesso',
      );
    }
  }
}

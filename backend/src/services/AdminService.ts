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

export interface AdminUpdateUserDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
  uf?: string;
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
      emailVerified: true,
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

  /** Lista todos os usuários (incluindo inativos) para o painel admin. */
  async listAll(): Promise<Omit<Usuario, 'senha'>[]> {
    const users = await this.usuarioRepo.findAllForAdmin();
    return users.map((u) => {
      const { senha: _, ...safe } = u as Record<string, unknown>;
      void _;
      return safe as Omit<Usuario, 'senha'>;
    });
  }

  /** Busca um usuário por ID — para visualização de perfil completo no admin. */
  async getUserById(targetId: number): Promise<Omit<Usuario, 'senha'>> {
    const user = await this.usuarioRepo.findByIdWithRelations(targetId);
    if (!user) throw AppError.notFound('Usuário não encontrado');
    const { senha: _, ...safe } = user as Record<string, unknown>;
    void _;
    return safe as Omit<Usuario, 'senha'>;
  }

  /**
   * Edita dados de um usuário (nome, email, etc.) via painel admin.
   * Verifica duplicata de e-mail antes de atualizar.
   */
  async updateUser(
    targetId: number,
    data: AdminUpdateUserDTO,
    requester: JWTPayload,
  ): Promise<Omit<Usuario, 'senha'>> {
    const target = await this.usuarioRepo.findById(targetId);
    if (!target) throw AppError.notFound('Usuário não encontrado');

    // Não permite editar usuário de role >= ao do requester (exceto a si mesmo)
    if (
      targetId !== requester.id &&
      ROLE_HIERARCHY[target.role] >= ROLE_HIERARCHY[requester.role]
    ) {
      throw AppError.forbidden('Sem permissão para editar este usuário');
    }

    // Verifica duplicata de e-mail (se o e-mail mudou)
    if (data.email && data.email !== target.email) {
      if (await this.usuarioRepo.existsByEmail(data.email)) {
        throw AppError.conflict('E-mail já está em uso por outro usuário');
      }
    }

    const updated = await this.usuarioRepo.update(targetId, data as Partial<Usuario>);
    if (!updated) throw AppError.notFound('Usuário não encontrado');

    const { senha: _, ...safe } = updated as Record<string, unknown>;
    void _;
    return safe as Omit<Usuario, 'senha'>;
  }

  /**
   * Ativa ou desativa um usuário.
   * Não permite alterar o status de usuário com role >= ao do requester.
   */
  async toggleStatus(
    targetId: number,
    status: boolean,
    requester: JWTPayload,
  ): Promise<{ message: string }> {
    const target = await this.usuarioRepo.findById(targetId);
    if (!target) throw AppError.notFound('Usuário não encontrado');

    if (
      targetId !== requester.id &&
      ROLE_HIERARCHY[target.role] >= ROLE_HIERARCHY[requester.role]
    ) {
      throw AppError.forbidden('Sem permissão para alterar o status deste usuário');
    }

    await this.usuarioRepo.setStatus(targetId, status);
    return { message: `Usuário ${status ? 'ativado' : 'desativado'} com sucesso` };
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

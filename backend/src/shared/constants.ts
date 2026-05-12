/**
 * Constantes e Enums globais do domínio.
 * Personagem fixo: Clara (feminino) — sem seleção de gênero no jogo.
 */

/**
 * Níveis de acesso do sistema.
 * - SUPER_ADMIN : pode criar/promover outros admins e tem acesso total.
 * - ADMIN       : admin geral, gerencia perguntas, campus, usuários.
 * - CAMPUS_ADMIN: admin restrito ao seu campus_id.
 * - PLAYER      : jogador comum (padrão de novos cadastros).
 */
export enum Role {
  SUPER_ADMIN  = 'super_admin',
  ADMIN        = 'admin',
  CAMPUS_ADMIN = 'campus_admin',
  PLAYER       = 'player',
}

/** Hierarquia numérica para comparação de permissões. Maior = mais poder. */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SUPER_ADMIN]:  4,
  [Role.ADMIN]:        3,
  [Role.CAMPUS_ADMIN]: 2,
  [Role.PLAYER]:       1,
};

/**
 * Status de usuário/recurso.
 */
export enum Status {
  ACTIVE   = 'active',
  INACTIVE = 'inactive',
  BANNED   = 'banned',
}

/**
 * Tipos de token de e-mail.
 */
export enum EmailTokenType {
  RESET_PASSWORD   = 'reset_password',
  EMAIL_VERIFY     = 'email_verify',
}

/** Duração padrão de tokens (em minutos). */
export const TOKEN_TTL_MINUTES = {
  RESET_PASSWORD: 60,
  EMAIL_VERIFY: 1440, // 24h
} as const;

/** Duração do JWT em segundos (8 horas). */
export const JWT_EXPIRES_IN = '8h';

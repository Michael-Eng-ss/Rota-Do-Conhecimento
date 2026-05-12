"use strict";
/**
 * Constantes e Enums globais do domínio.
 * Personagem fixo: Clara (feminino) — sem seleção de gênero no jogo.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRES_IN = exports.TOKEN_TTL_MINUTES = exports.EmailTokenType = exports.Status = exports.ROLE_HIERARCHY = exports.Role = void 0;
/**
 * Níveis de acesso do sistema.
 * - SUPER_ADMIN : pode criar/promover outros admins e tem acesso total.
 * - ADMIN       : admin geral, gerencia perguntas, campus, usuários.
 * - CAMPUS_ADMIN: admin restrito ao seu campus_id.
 * - PLAYER      : jogador comum (padrão de novos cadastros).
 */
var Role;
(function (Role) {
    Role[Role["SUPER_ADMIN"] = 1] = "SUPER_ADMIN";
    Role[Role["ADMIN"] = 2] = "ADMIN";
    Role[Role["PLAYER"] = 3] = "PLAYER";
    Role[Role["CAMPUS_ADMIN"] = 4] = "CAMPUS_ADMIN";
})(Role || (exports.Role = Role = {}));
/** Hierarquia numérica para comparação de permissões. Maior = mais poder. */
exports.ROLE_HIERARCHY = {
    [Role.SUPER_ADMIN]: 4,
    [Role.ADMIN]: 3,
    [Role.CAMPUS_ADMIN]: 2,
    [Role.PLAYER]: 1,
};
/**
 * Status de usuário/recurso.
 */
var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["INACTIVE"] = "inactive";
    Status["BANNED"] = "banned";
})(Status || (exports.Status = Status = {}));
/**
 * Tipos de token de e-mail.
 */
var EmailTokenType;
(function (EmailTokenType) {
    EmailTokenType["RESET_PASSWORD"] = "reset_password";
    EmailTokenType["EMAIL_VERIFY"] = "confirm_email";
})(EmailTokenType || (exports.EmailTokenType = EmailTokenType = {}));
/** Duração padrão de tokens (em minutos). */
exports.TOKEN_TTL_MINUTES = {
    RESET_PASSWORD: 60,
    EMAIL_VERIFY: 1440, // 24h
};
/** Duração do JWT em segundos (8 horas). */
exports.JWT_EXPIRES_IN = '8h';
//# sourceMappingURL=constants.js.map
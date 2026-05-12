import { Role } from './constants';
/**
 * Payload do JWT — compartilhado entre AuthService, auth.middleware e controllers.
 * Mantido em shared/types para evitar dependência circular.
 */
export interface JWTPayload {
    id: number;
    name: string;
    role: Role;
    campusId: number | null;
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=types.d.ts.map
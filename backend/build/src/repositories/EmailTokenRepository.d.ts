import { DataSource } from 'typeorm';
import { EmailToken } from '../entities/EmailToken';
import { EmailTokenType } from '../shared/constants';
export declare class EmailTokenRepository {
    private repo;
    constructor(dataSource: DataSource);
    /** Cria um token com TTL em minutos. */
    create(usuarioId: number, tipo: EmailTokenType, ttlMinutes: number): Promise<string>;
    /** Busca token válido (não expirado, não usado). */
    findValid(token: string, tipo: EmailTokenType): Promise<EmailToken | null>;
    markUsed(token: string): Promise<void>;
}
//# sourceMappingURL=EmailTokenRepository.d.ts.map
import { EmailTokenType } from '../shared/constants';
export declare class EmailToken {
    id: number;
    usuarioId: number;
    token: string;
    tipo: EmailTokenType;
    expiraEm: Date;
    usado: boolean;
    createdAt: Date;
}
//# sourceMappingURL=EmailToken.d.ts.map
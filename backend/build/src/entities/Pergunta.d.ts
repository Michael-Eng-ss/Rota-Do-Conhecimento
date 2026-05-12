import { Categoria } from './Categoria';
import { Alternativa } from './Alternativa';
import { Campus } from './Campus';
export declare class Pergunta {
    id: number;
    enunciado: string;
    dificuldade: number | null;
    categoriaId: number | null;
    categoria: Categoria | null;
    /** Campus do qual a pergunta foi originada. */
    campusId: number | null;
    campus: Campus | null;
    status: boolean;
    createdAt: Date;
    alternativas: Alternativa[];
}
//# sourceMappingURL=Pergunta.d.ts.map
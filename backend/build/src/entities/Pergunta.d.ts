import { Categoria } from './Categoria';
import { Alternativa } from './Alternativa';
import { PerguntaNivel } from './PerguntaNivel';
import { Quiz } from './Quiz';
export declare class Pergunta {
    id: number;
    conteudo: string | null;
    perguntasnivelid: number;
    tempo: number;
    pathimage: string | null;
    status: boolean;
    categoriasid: number;
    quizid: number | null;
    categoria: Categoria;
    nivel: PerguntaNivel;
    quiz: Quiz | null;
    alternativas: Alternativa[];
}
//# sourceMappingURL=Pergunta.d.ts.map
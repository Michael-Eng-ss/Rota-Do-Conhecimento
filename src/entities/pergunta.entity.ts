import type { Pergunta as PerguntaType, PerguntaCreate } from '@/models/types';

export class Pergunta {
  readonly id: number;
  readonly conteudo: string | null;
  readonly perguntasnivelid: number;
  readonly tempo: number;
  readonly pathimage: string | null;
  readonly status: boolean;
  readonly categoriasid: number;
  readonly quizid: number | null;

  private constructor(data: PerguntaType) {
    this.id = data.id;
    this.conteudo = data.conteudo;
    this.perguntasnivelid = data.perguntasnivelid;
    this.tempo = data.tempo;
    this.pathimage = data.pathimage;
    this.status = data.status;
    this.categoriasid = data.categoriasid;
    this.quizid = data.quizid;
  }

  static fromApi(data: PerguntaType): Pergunta {
    return new Pergunta(data);
  }

  static fromApiList(data: PerguntaType[]): Pergunta[] {
    return data.map(Pergunta.fromApi);
  }

  toApi(): PerguntaType {
    return {
      id: this.id, conteudo: this.conteudo, perguntasnivelid: this.perguntasnivelid,
      tempo: this.tempo, pathimage: this.pathimage, status: this.status,
      categoriasid: this.categoriasid, quizid: this.quizid,
    };
  }

  static createPayload(conteudo: string, categoriasid: number, perguntasnivelid: number, tempo?: number): PerguntaCreate {
    return { conteudo, categoriasid, perguntasnivelid, tempo };
  }

  get isActive(): boolean {
    return this.status;
  }

  get hasImage(): boolean {
    return !!this.pathimage;
  }

  get texto(): string {
    return this.conteudo || '';
  }
}

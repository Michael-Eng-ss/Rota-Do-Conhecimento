import type { Alternativa as AlternativaType, AlternativaCreate } from '@/models/types';

export class Alternativa {
  readonly id: number;
  readonly conteudo: string | null;
  readonly imagem: string | null;
  readonly correta: boolean;
  readonly perguntasid: number;

  private constructor(data: AlternativaType) {
    this.id = data.id;
    this.conteudo = data.conteudo;
    this.imagem = data.imagem;
    this.correta = data.correta;
    this.perguntasid = data.perguntasid;
  }

  static fromApi(data: AlternativaType): Alternativa {
    return new Alternativa(data);
  }

  static fromApiList(data: AlternativaType[]): Alternativa[] {
    return data.map(Alternativa.fromApi);
  }

  toApi(): AlternativaType {
    return { id: this.id, conteudo: this.conteudo, imagem: this.imagem, correta: this.correta, perguntasid: this.perguntasid };
  }

  static createPayload(conteudo: string, perguntasid: number, correta: boolean, imagem?: string): AlternativaCreate {
    return { conteudo, perguntasid, correta, imagem };
  }

  get texto(): string {
    return this.conteudo || '';
  }

  get isCorrect(): boolean {
    return this.correta;
  }

  get hasImage(): boolean {
    return !!this.imagem;
  }
}

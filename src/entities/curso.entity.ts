import type { Curso as CursoType } from '@/models/types';

export class Curso {
  readonly id: number;
  readonly nome: string;
  readonly imagem: string;

  private constructor(data: CursoType) {
    this.id = data.id;
    this.nome = data.nome;
    this.imagem = data.imagem;
  }

  static fromApi(data: CursoType): Curso {
    return new Curso(data);
  }

  static fromApiList(data: CursoType[]): Curso[] {
    return data.map(Curso.fromApi);
  }

  toApi(): CursoType {
    return { id: this.id, nome: this.nome, imagem: this.imagem };
  }

  get hasImage(): boolean {
    return !!this.imagem;
  }
}

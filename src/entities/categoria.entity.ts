import type { Categoria as CategoriaType, CategoriaCreate } from '@/models/types';

export class Categoria {
  readonly id: number;
  readonly descricao: string;
  readonly imagem: string;
  readonly status: boolean;
  readonly cursoId: number;

  private constructor(data: CategoriaType) {
    this.id = data.id;
    this.descricao = data.descricao;
    this.imagem = data.imagem;
    this.status = data.status;
    this.cursoId = data.cursoId;
  }

  static fromApi(data: CategoriaType): Categoria {
    return new Categoria(data);
  }

  static fromApiList(data: CategoriaType[]): Categoria[] {
    return data.map(Categoria.fromApi);
  }

  toApi(): CategoriaType {
    return { id: this.id, descricao: this.descricao, imagem: this.imagem, status: this.status, cursoId: this.cursoId };
  }

  static createPayload(descricao: string, cursoId: number, imagem?: string): CategoriaCreate {
    return { descricao, cursoId, imagem };
  }

  get isActive(): boolean {
    return this.status;
  }

  get nome(): string {
    return this.descricao;
  }
}

import type { Quiz as QuizType, QuizCreate } from '@/models/types';

export class Quiz {
  readonly id: number;
  readonly titulo: string;
  readonly imagem: string;
  readonly avaliativo: boolean;
  readonly status: boolean;
  readonly cursoid: number;
  readonly usuarioid: number;

  private constructor(data: QuizType) {
    this.id = data.id;
    this.titulo = data.titulo;
    this.imagem = data.imagem;
    this.avaliativo = data.avaliativo;
    this.status = data.status;
    this.cursoid = data.cursoid;
    this.usuarioid = data.usuarioid;
  }

  static fromApi(data: QuizType): Quiz {
    return new Quiz(data);
  }

  static fromApiList(data: QuizType[]): Quiz[] {
    return data.map(Quiz.fromApi);
  }

  toApi(): QuizType {
    return {
      id: this.id, titulo: this.titulo, imagem: this.imagem, avaliativo: this.avaliativo,
      status: this.status, cursoid: this.cursoid, usuarioid: this.usuarioid,
    };
  }

  static createPayload(titulo: string, cursoid: number, usuarioid: number, avaliativo?: boolean): QuizCreate {
    return { titulo, cursoid, usuarioid, avaliativo };
  }

  get isActive(): boolean {
    return this.status;
  }

  get isAvaliativo(): boolean {
    return this.avaliativo;
  }
}

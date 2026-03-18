import type { ProgressoPerguntas as ProgressoType, ProgressoCreate } from '@/models/types';

export class ProgressoPerguntas {
  readonly id: number;
  readonly usuariosid: number;
  readonly perguntasid: number;

  private constructor(data: ProgressoType) {
    this.id = data.id;
    this.usuariosid = data.usuariosid;
    this.perguntasid = data.perguntasid;
  }

  static fromApi(data: ProgressoType): ProgressoPerguntas {
    return new ProgressoPerguntas(data);
  }

  static fromApiList(data: ProgressoType[]): ProgressoPerguntas[] {
    return data.map(ProgressoPerguntas.fromApi);
  }

  toApi(): ProgressoType {
    return { id: this.id, usuariosid: this.usuariosid, perguntasid: this.perguntasid };
  }

  static createPayload(usuariosid: number, perguntasid: number): ProgressoCreate {
    return { usuariosid, perguntasid };
  }
}

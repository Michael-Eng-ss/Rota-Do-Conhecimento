import type { PerguntaNivel as PerguntaNivelType } from '@/models/types';

export class PerguntaNivel {
  readonly id: number;
  readonly nivel: number;
  readonly pontuacao: number;
  readonly tempo: number;

  private constructor(data: PerguntaNivelType) {
    this.id = data.id;
    this.nivel = data.nivel;
    this.pontuacao = data.pontuacao;
    this.tempo = data.tempo;
  }

  static fromApi(data: PerguntaNivelType): PerguntaNivel {
    return new PerguntaNivel(data);
  }

  static fromApiList(data: PerguntaNivelType[]): PerguntaNivel[] {
    return data.map(PerguntaNivel.fromApi);
  }

  toApi(): PerguntaNivelType {
    return { id: this.id, nivel: this.nivel, pontuacao: this.pontuacao, tempo: this.tempo };
  }

  get label(): string {
    return `Nível ${this.nivel}`;
  }
}

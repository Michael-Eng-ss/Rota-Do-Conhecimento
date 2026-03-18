import type { QuizAvaliativoUsuario as QAUType, QuizAvaliativoCreate } from '@/models/types';

export class QuizAvaliativoUsuario {
  readonly id: number;
  readonly usuarioid: number;
  readonly quizid: number;
  readonly pontuacao: number;
  readonly horainicial: string;
  readonly horafinal: string;

  private constructor(data: QAUType) {
    this.id = data.id;
    this.usuarioid = data.usuarioid;
    this.quizid = data.quizid;
    this.pontuacao = data.pontuacao;
    this.horainicial = data.horainicial;
    this.horafinal = data.horafinal;
  }

  static fromApi(data: QAUType): QuizAvaliativoUsuario {
    return new QuizAvaliativoUsuario(data);
  }

  static fromApiList(data: QAUType[]): QuizAvaliativoUsuario[] {
    return data.map(QuizAvaliativoUsuario.fromApi);
  }

  toApi(): QAUType {
    return {
      id: this.id, usuarioid: this.usuarioid, quizid: this.quizid,
      pontuacao: this.pontuacao, horainicial: this.horainicial, horafinal: this.horafinal,
    };
  }

  static createPayload(usuarioid: number, quizid: number, pontuacao?: number): QuizAvaliativoCreate {
    return { usuarioid, quizid, pontuacao };
  }

  get duracao(): number {
    const inicio = new Date(this.horainicial).getTime();
    const fim = new Date(this.horafinal).getTime();
    return Math.max(0, fim - inicio);
  }

  get duracaoMinutos(): number {
    return Math.round(this.duracao / 60000);
  }
}

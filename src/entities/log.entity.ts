import type { Log as LogType } from '@/models/types';

export class Log {
  readonly id: number;
  readonly usuariosid: number;
  readonly datalogin: string;
  readonly descricao: string;

  private constructor(data: LogType) {
    this.id = data.id;
    this.usuariosid = data.usuariosid;
    this.datalogin = data.datalogin;
    this.descricao = data.descricao;
  }

  static fromApi(data: LogType): Log {
    return new Log(data);
  }

  static fromApiList(data: LogType[]): Log[] {
    return data.map(Log.fromApi);
  }

  toApi(): LogType {
    return { id: this.id, usuariosid: this.usuariosid, datalogin: this.datalogin, descricao: this.descricao };
  }

  get dataFormatada(): string {
    return new Date(this.datalogin).toLocaleString('pt-BR');
  }
}

import type { UsuarioPublico, UsuarioCreate } from '@/models/types';

export class Usuario {
  readonly id: number;
  readonly nome: string;
  readonly email: string;
  readonly role: number;
  readonly pontuacao: number;
  readonly foto: string;
  readonly cursoid: number;
  readonly campusid: number | null;
  readonly cidade: string;
  readonly uf: string;
  readonly telefone: string;
  readonly sexo: number;
  readonly turma: string | null;
  readonly periodo: number | null;
  readonly datanascimento: string;
  readonly status: boolean;

  private constructor(data: UsuarioPublico) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.role = data.role;
    this.pontuacao = data.pontuacao;
    this.foto = data.foto;
    this.cursoid = data.cursoid;
    this.campusid = data.campusid;
    this.cidade = data.cidade;
    this.uf = data.uf;
    this.telefone = data.telefone;
    this.sexo = data.sexo;
    this.turma = data.turma;
    this.periodo = data.periodo;
    this.datanascimento = data.datanascimento;
    this.status = data.status;
  }

  static fromApi(data: UsuarioPublico): Usuario {
    return new Usuario(data);
  }

  static fromApiList(data: UsuarioPublico[]): Usuario[] {
    return data.map(Usuario.fromApi);
  }

  toApi(): UsuarioPublico {
    return {
      id: this.id, nome: this.nome, email: this.email, role: this.role,
      pontuacao: this.pontuacao, foto: this.foto, cursoid: this.cursoid,
      campusid: this.campusid, cidade: this.cidade, uf: this.uf,
      telefone: this.telefone, sexo: this.sexo, turma: this.turma,
      periodo: this.periodo, datanascimento: this.datanascimento, status: this.status,
    };
  }

  static createPayload(nome: string, email: string, senha: string, cursoid: number): UsuarioCreate {
    return { nome, email, senha, cursoid };
  }

  get isAdmin(): boolean {
    return this.role === 1;
  }

  get isActive(): boolean {
    return this.status;
  }

  get displayName(): string {
    return this.nome || 'Jogador';
  }
}

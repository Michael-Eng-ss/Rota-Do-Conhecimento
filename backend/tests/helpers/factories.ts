import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Usuario } from '../../src/entities/Usuario';
import { Campus } from '../../src/entities/Campus';
import { Curso } from '../../src/entities/Curso';
import { Categoria } from '../../src/entities/Categoria';
import { PerguntaNivel } from '../../src/entities/PerguntaNivel';
import { Pergunta } from '../../src/entities/Pergunta';
import { Role } from '../../src/shared/constants';

const BCRYPT_ROUNDS = 4; // Rápido para testes

export async function createCampus(ds: DataSource, nome = 'Campus Teste'): Promise<Campus> {
  return ds.getRepository(Campus).save(ds.getRepository(Campus).create({ nome }));
}

export async function createCurso(ds: DataSource, nome = 'Curso Teste'): Promise<Curso> {
  return ds.getRepository(Curso).save(ds.getRepository(Curso).create({ nome }));
}

export async function createUser(
  ds: DataSource,
  overrides: Partial<Usuario> & { senha?: string } = {},
): Promise<Usuario> {
  const repo    = ds.getRepository(Usuario);
  const senha   = overrides.senha ?? 'senha123';
  const hashed  = await bcrypt.hash(senha, BCRYPT_ROUNDS);
  const { senha: _, ...rest } = overrides;
  void _;

  const entity = repo.create({
    nome:      rest.nome      ?? 'Jogador Teste',
    email:     rest.email     ?? `teste${Date.now()}@mail.com`,
    senha:     hashed,
    role:      rest.role      ?? Role.PLAYER,
    pontuacao: rest.pontuacao ?? 0,
    status:    rest.status    ?? true,
    campusId:  rest.campusId  ?? null,
    cursoId:   rest.cursoId   ?? null,
  });
  return repo.save(entity);
}

export async function createSuperAdmin(ds: DataSource): Promise<Usuario> {
  return createUser(ds, {
    nome:  'Super Admin',
    email: `superadmin${Date.now()}@mail.com`,
    role:  Role.SUPER_ADMIN,
    senha: 'admin123',
  });
}

export async function createAdminUser(ds: DataSource): Promise<Usuario> {
  return createUser(ds, {
    nome:  'Admin Teste',
    email: `admin${Date.now()}@mail.com`,
    role:  Role.ADMIN,
    senha: 'admin123',
  });
}

export async function createCampusAdmin(ds: DataSource, campusId: number): Promise<Usuario> {
  return createUser(ds, {
    nome:     'Campus Admin Teste',
    email:    `campusadmin${Date.now()}@mail.com`,
    role:     Role.CAMPUS_ADMIN,
    campusId,
    senha:    'admin123',
  });
}

export async function createCategoria(ds: DataSource, cursoid: number, descricao = 'Categoria Teste'): Promise<Categoria> {
  return ds.getRepository(Categoria).save(ds.getRepository(Categoria).create({ descricao, cursoid, status: true }));
}

export async function createPerguntaNivel(ds: DataSource, nivel = 1, pontuacao = 10, tempo = 30): Promise<PerguntaNivel> {
  return ds.getRepository(PerguntaNivel).save(ds.getRepository(PerguntaNivel).create({ nivel, pontuacao, tempo }));
}

export async function createPergunta(
  ds: DataSource, 
  categoriasid: number, 
  perguntasnivelid: number, 
  conteudo = 'Pergunta Teste?'
): Promise<Pergunta> {
  return ds.getRepository(Pergunta).save(
    ds.getRepository(Pergunta).create({ conteudo, categoriasid, perguntasnivelid, status: true, tempo: 30 })
  );
}


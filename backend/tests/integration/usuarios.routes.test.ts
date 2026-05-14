/**
 * Testes de integração: Fluxo de Cadastro e Login (/usuarios + /auth)
 *
 * Cenários cobertos:
 * - POST /usuarios → 201 (cadastro bem-sucedido)
 * - POST /usuarios → 409 (e-mail duplicado)
 * - POST /usuarios → 400 (campos obrigatórios faltando)
 * - POST /auth     → 200 com token (login imediato após cadastro)
 * - GET  /usuarios/:id → 200 (perfil acessível após login)
 */

import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Usuario } from '../../src/entities/Usuario';

let app: import('express').Express;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  const mod = await import('../../src/app');
  app = mod.app;

  // Limpa usuários para garantir isolamento
  await TestDataSource.getRepository(Usuario).clear();
});

// Teardown gerenciado pelo globalTeardown.ts — não destruir aqui

describe('POST /usuarios — Cadastro de Usuário', () => {
  let cursoId: number;

  beforeAll(async () => {
    const cursoRepo = TestDataSource.getRepository(require('../../src/entities/Curso').Curso);
    const curso = await cursoRepo.save(cursoRepo.create({ nome: 'Curso T' }));
    cursoId = curso.id;
  });

  const getNovoUsuario = () => ({
    nome: 'Clara Teste',
    email: `clara.${Date.now()}@mail.com`,
    senha: 'senha@123',
    cursoid: cursoId,  // Formato snake_case enviado pelo frontend
  });

  it('deve criar usuário com sucesso e retornar 201', async () => {
    const novoUsuario = getNovoUsuario();
    const res = await request(app)
      .post('/usuarios')
      .send(novoUsuario);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(novoUsuario.email);
    expect(res.body.nome).toBe(novoUsuario.nome);
    // Senha nunca deve ser retornada
    expect(res.body).not.toHaveProperty('senha');
  });

  it('deve retornar 409 ao tentar criar com e-mail duplicado', async () => {
    const novoUsuario = getNovoUsuario();
    // first insert
    await request(app).post('/usuarios').send(novoUsuario);
    // second insert
    const res = await request(app)
      .post('/usuarios')
      .send(novoUsuario); // mesmo e-mail de antes

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/e-mail/i);
  });

  it('deve retornar 400 se nome ou e-mail ou senha faltarem', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({ email: 'incompleto@mail.com' }); // sem nome e senha

    expect(res.status).toBe(400);
  });
});

describe('Fluxo completo: Cadastro → Login → Perfil', () => {
  let cursoId: number;
  let credenciais: any;
  let userId: number;
  let token: string;

  beforeAll(async () => {
    const cursoRepo = TestDataSource.getRepository(require('../../src/entities/Curso').Curso);
    const curso = await cursoRepo.save(cursoRepo.create({ nome: 'Curso Flow' }));
    cursoId = curso.id;
    credenciais = {
      nome: 'Jogador Flow',
      email: `flow.${Date.now()}@mail.com`,
      senha: 'fluxoSeguro!99',
      cursoid: cursoId,
    };
  });

  it('[1/3] deve criar o usuário com cursoid (snake_case do frontend)', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send(credenciais);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id as number;
    await TestDataSource.getRepository(Usuario).update(userId, { emailVerified: true });
  });

  it('[2/3] deve autenticar com as credenciais recém-cadastradas', async () => {
    const res = await request(app)
      .post('/auth')
      .send({ email: credenciais.email, senha: credenciais.senha });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).not.toHaveProperty('senha');
    token = res.body.token as string;
  });

  it('[3/3] deve acessar o perfil do usuário com o token JWT', async () => {
    const res = await request(app)
      .get(`/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(credenciais.email);
    expect(res.body.nome).toBe(credenciais.nome);
  });
});

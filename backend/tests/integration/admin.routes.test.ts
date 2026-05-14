/**
 * Testes de integração: Rotas Admin (/admin)
 *
 * Cenários cobertos:
 * - GET  /admin/usuarios/:id         → perfil completo do usuário
 * - PUT  /admin/usuarios/:id         → edição de email e nome
 * - PUT  /admin/usuarios/:id/status  → desativar usuário bloqueia o login
 * - PUT  /admin/usuarios/:id/status  → reativar usuário restaura o login
 * - Proteção: player não pode acessar rotas admin
 */

import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Usuario } from '../../src/entities/Usuario';
import { Campus } from '../../src/entities/Campus';
import { createUser, createSuperAdmin, createCampus } from '../helpers/factories';
import { Role } from '../../src/shared/constants';

let app: import('express').Express;
let superAdminToken: string;
let targetUserId: number;
let targetUserEmail: string;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  const mod = await import('../../src/app');
  app = mod.app;

  await TestDataSource.getRepository(Usuario).clear();
  await TestDataSource.getRepository(Campus).clear();

  // Cria super_admin para executar as operações
  const sa = await createSuperAdmin(TestDataSource);
  const loginRes = await request(app)
    .post('/auth')
    .send({ email: sa.email, senha: 'admin123' });
  superAdminToken = loginRes.body.token as string;

  // Cria usuário alvo para os testes
  const target = await createUser(TestDataSource, {
    email: `target.${Date.now()}@mail.com`,
    senha: 'senha123',
    role: Role.PLAYER,
  });
  targetUserId = target.id;
  targetUserEmail = target.email;
});

// Teardown gerenciado pelo globalTeardown.ts — não destruir aqui

describe('GET /admin/usuarios/:id — Perfil Completo', () => {
  it('deve retornar perfil completo do usuário', async () => {
    const res = await request(app)
      .get(`/admin/usuarios/${targetUserId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(targetUserId);
    expect(res.body).not.toHaveProperty('senha');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('status');
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const res = await request(app)
      .get('/admin/usuarios/999999')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /admin/usuarios/:id — Edição de Usuário', () => {
  it('deve editar o email do usuário com sucesso', async () => {
    const novoEmail = `editado.${Date.now()}@mail.com`;

    const res = await request(app)
      .put(`/admin/usuarios/${targetUserId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ email: novoEmail, nome: 'Nome Editado' });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(novoEmail);
    expect(res.body.nome).toBe('Nome Editado');

    // Atualiza para verificações subsequentes
    targetUserEmail = novoEmail;
  });

  it('deve retornar 409 se o novo email já está em uso', async () => {
    // Cria outro usuário com email único
    const outro = await createUser(TestDataSource, { email: `outro.${Date.now()}@mail.com`, senha: 'x' });

    const res = await request(app)
      .put(`/admin/usuarios/${targetUserId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ email: outro.email }); // tenta usar o email do outro usuário

    expect(res.status).toBe(409);
  });
});

describe('PUT /admin/usuarios/:id/status — Toggle de Status', () => {
  it('deve desativar o usuário (status=false)', async () => {
    const res = await request(app)
      .put(`/admin/usuarios/${targetUserId}/status`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ status: false });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/desativado/i);
  });

  it('usuário desativado não deve conseguir fazer login (403)', async () => {
    const loginRes = await request(app)
      .post('/auth')
      .send({ email: targetUserEmail, senha: 'senha123' });

    expect(loginRes.status).toBe(403);
    expect(loginRes.body.message).toMatch(/desativada|desativado/i);
  });

  it('deve reativar o usuário (status=true)', async () => {
    const res = await request(app)
      .put(`/admin/usuarios/${targetUserId}/status`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ status: true });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/ativado/i);
  });

  it('usuário reativado deve conseguir fazer login novamente (200)', async () => {
    const loginRes = await request(app)
      .post('/auth')
      .send({ email: targetUserEmail, senha: 'senha123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });

  it('deve retornar 400 se status não for booleano', async () => {
    const res = await request(app)
      .put(`/admin/usuarios/${targetUserId}/status`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ status: 'ativo' }); // string em vez de boolean

    expect(res.status).toBe(400);
  });
});

describe('Proteção das Rotas de Admin', () => {
  let playerToken: string;

  beforeAll(async () => {
    const player = await createUser(TestDataSource, { email: `player.prot.${Date.now()}@mail.com`, senha: 'abc123' });
    const res = await request(app)
      .post('/auth')
      .send({ email: player.email, senha: 'abc123' });
    playerToken = res.body.token as string;
  });

  it('player não pode acessar GET /admin/usuarios/:id → 403', async () => {
    const res = await request(app)
      .get(`/admin/usuarios/${targetUserId}`)
      .set('Authorization', `Bearer ${playerToken}`);
    expect(res.status).toBe(403);
  });

  it('player não pode editar usuário via admin → 403', async () => {
    const res = await request(app)
      .put(`/admin/usuarios/${targetUserId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ nome: 'Hacker' });
    expect(res.status).toBe(403);
  });

  it('player não pode alterar status → 403', async () => {
    const res = await request(app)
      .put(`/admin/usuarios/${targetUserId}/status`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ status: false });
    expect(res.status).toBe(403);
  });
});

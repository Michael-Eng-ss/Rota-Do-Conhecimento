/**
 * Testes de integração: Rotas de Campus (/campus)
 *
 * Cenários cobertos:
 * - GET  /campus                → lista pública, sem autenticação
 * - GET  /campus/:id            → detalhe público
 * - GET  /campus/:id (inex.)   → 404
 * - POST /campus                → criar (admin) / 401 sem token / 403 player
 * - POST /campus (sem nome)     → 400
 * - PUT  /campus/:id            → atualizar (admin)
 * - DELETE /campus/:id          → remover (admin)
 */

import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Campus  } from '../../src/entities/Campus';
import { Usuario } from '../../src/entities/Usuario';
import { createSuperAdmin, createUser, createCampus } from '../helpers/factories';

let app: import('express').Express;
let adminToken: string;
let playerToken: string;

beforeAll(async () => {
  process.env.NODE_ENV   = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) await TestDataSource.initialize();

  const mod = await import('../../src/app');
  app = mod.app;

  await TestDataSource.getRepository(Usuario).clear();
  await TestDataSource.getRepository(Campus).clear();

  // Admin
  const sa = await createSuperAdmin(TestDataSource);
  const saLogin = await request(app).post('/auth').send({ email: sa.email, senha: 'admin123' });
  adminToken = saLogin.body.token as string;

  // Player
  const player = await createUser(TestDataSource, { email: `player.campus.${Date.now()}@mail.com`, senha: 'p123' });
  const playerLogin = await request(app).post('/auth').send({ email: player.email, senha: 'p123' });
  playerToken = playerLogin.body.token as string;
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /campus — Listagem pública', () => {
  it('deve listar campus sem autenticação', async () => {
    await createCampus(TestDataSource, `Campus Público ${Date.now()}`);
    const res = await request(app).get('/campus');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve retornar array mesmo sem campus cadastrados', async () => {
    await TestDataSource.getRepository(Campus).clear();
    const res = await request(app).get('/campus');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /campus — Criação (admin)', () => {
  it('deve criar campus com sucesso (admin)', async () => {
    const res = await request(app)
      .post('/campus')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: `Campus Novo ${Date.now()}` });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBeDefined();
  });

  it('deve retornar 400 ao criar campus sem nome', async () => {
    const res = await request(app)
      .post('/campus')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app)
      .post('/campus')
      .send({ nome: 'Sem Auth' });

    expect(res.status).toBe(401);
  });

  it('player não pode criar campus → 403', async () => {
    const res = await request(app)
      .post('/campus')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ nome: 'Invasão Player' });

    expect(res.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /campus/:id — Detalhe', () => {
  let campusId: number;

  beforeAll(async () => {
    const c = await createCampus(TestDataSource, `Campus Detalhe ${Date.now()}`);
    campusId = c.id;
  });

  it('deve retornar o campus pelo ID (público)', async () => {
    const res = await request(app).get(`/campus/${campusId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(campusId);
  });

  it('deve retornar 404 para ID inexistente', async () => {
    const res = await request(app).get('/campus/999999');
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /campus/:id — Atualização', () => {
  let campusId: number;

  beforeAll(async () => {
    const c = await createCampus(TestDataSource, `Campus Update ${Date.now()}`);
    campusId = c.id;
  });

  it('deve atualizar o campus com sucesso (admin)', async () => {
    const novoNome = `Campus Editado ${Date.now()}`;
    const res = await request(app)
      .put(`/campus/${campusId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: novoNome });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe(novoNome);
  });

  it('player não pode atualizar campus → 403', async () => {
    const res = await request(app)
      .put(`/campus/${campusId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ nome: 'Hack' });

    expect(res.status).toBe(403);
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app)
      .put(`/campus/${campusId}`)
      .send({ nome: 'Sem auth' });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /campus/:id — Remoção', () => {
  let campusId: number;

  beforeAll(async () => {
    const c = await createCampus(TestDataSource, `Campus Delete ${Date.now()}`);
    campusId = c.id;
  });

  it('player não pode deletar campus → 403', async () => {
    const res = await request(app)
      .delete(`/campus/${campusId}`)
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.status).toBe(403);
  });

  it('deve deletar o campus com sucesso (admin)', async () => {
    const res = await request(app)
      .delete(`/campus/${campusId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removido/i);
  });

  it('deve retornar 404 ao deletar campus já removido', async () => {
    const res = await request(app)
      .delete(`/campus/${campusId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});

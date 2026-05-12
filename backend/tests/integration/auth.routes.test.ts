import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Usuario } from '../../src/entities/Usuario';
import { Campus }  from '../../src/entities/Campus';
import { createUser, createSuperAdmin, createCampusAdmin, createCampus } from '../helpers/factories';
import { Role } from '../../src/shared/constants';

// ── Setup / Teardown global da suite ─────────────────────────────────────
// O globalSetup não compartilha memória com workers de teste no Jest,
// por isso inicializamos e destruímos o DataSource aqui.

let app: import('express').Express;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  // Importa o app DEPOIS que o DataSource já está inicializado
  const mod = await import('../../src/app');
  app = mod.app;
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});

/**
 * Testes de integração: Rotas de Auth (/auth)
 *
 * Cenários cobertos:
 * - Login válido com player       → 200 + token + role = 'player'
 * - Login válido com super_admin  → 200 + token + role = 'super_admin'
 * - Login com e-mail inexistente  → 401
 * - Login com senha errada        → 401
 * - Login de usuário desativado   → 403
 * - Rota admin sem token          → 401
 * - Rota admin com token player   → 403
 * - Rota admin com token admin    → 200
 * - campus_admin acessa campus errado → 403
 * - campus_admin acessa campus correto → 200
 */
describe('POST /auth — Login', () => {
  let playerEmail: string;
  let superAdminEmail: string;
  let superAdminToken: string;

  beforeAll(async () => {
    await TestDataSource.getRepository(Usuario).clear();

    const player = await createUser(TestDataSource, { senha: 'senha123' });
    playerEmail = player.email;

    const sa = await createSuperAdmin(TestDataSource);
    superAdminEmail = sa.email;
  });

  it('deve fazer login com credenciais válidas de player', async () => {
    const res = await request(app)
      .post('/auth')
      .send({ email: playerEmail, senha: 'senha123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.role).toBe(Role.PLAYER);
    expect(res.body.user).not.toHaveProperty('senha');
  });

  it('deve retornar role=super_admin no token do super admin', async () => {
    const res = await request(app)
      .post('/auth')
      .send({ email: superAdminEmail, senha: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe(Role.SUPER_ADMIN);
    superAdminToken = res.body.token as string;
  });

  it('deve retornar 401 para e-mail inexistente', async () => {
    const res = await request(app)
      .post('/auth')
      .send({ email: 'naoexiste@mail.com', senha: 'qualquer' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/incorretos/i);
  });

  it('deve retornar 401 para senha errada', async () => {
    const res = await request(app)
      .post('/auth')
      .send({ email: playerEmail, senha: 'senhaerrada' });

    expect(res.status).toBe(401);
  });

  it('deve retornar 400 se campos obrigatórios faltarem', async () => {
    const res = await request(app)
      .post('/auth')
      .send({ email: playerEmail }); // sem senha

    expect(res.status).toBe(400);
  });

  it('deve retornar 403 para usuário desativado', async () => {
    const inativo = await createUser(TestDataSource, {
      email: `inativo${Date.now()}@mail.com`,
      senha: 'senha123',
      status: false,
    });

    const res = await request(app)
      .post('/auth')
      .send({ email: inativo.email, senha: 'senha123' });

    expect(res.status).toBe(403);
  });

  // ── Proteção das Rotas Admin ─────────────────────────────────────────────

  it('GET /admin/usuarios sem token → 401', async () => {
    const res = await request(app).get('/admin/usuarios');
    expect(res.status).toBe(401);
  });

  it('GET /admin/usuarios com token de player → 403', async () => {
    const loginRes = await request(app)
      .post('/auth')
      .send({ email: playerEmail, senha: 'senha123' });
    const playerToken = loginRes.body.token as string;

    const res = await request(app)
      .get('/admin/usuarios')
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.status).toBe(403);
  });

  it('GET /admin/usuarios com token de super_admin → 200', async () => {
    const res = await request(app)
      .get('/admin/usuarios')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /admin/admins com token de player → 403', async () => {
    const loginRes = await request(app)
      .post('/auth')
      .send({ email: playerEmail, senha: 'senha123' });
    const playerToken = loginRes.body.token as string;

    const res = await request(app)
      .post('/admin/admins')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ nome: 'Test', email: 'novo@mail.com', senha: '123', role: Role.ADMIN });

    expect(res.status).toBe(403);
  });
});

describe('Rotas Admin — Campus Admin', () => {
  let campusA: { id: number };
  let campusB: { id: number };
  let campusAdminToken: string;

  beforeAll(async () => {
    campusA = await createCampus(TestDataSource, `Campus A ${Date.now()}`);
    campusB = await createCampus(TestDataSource, `Campus B ${Date.now()}`);

    const ca = await createCampusAdmin(TestDataSource, campusA.id);

    const loginRes = await request(app)
      .post('/auth')
      .send({ email: ca.email, senha: 'admin123' });
    campusAdminToken = loginRes.body.token as string;
  });

  it('campus_admin acessa campus correto → 200', async () => {
    const res = await request(app)
      .get(`/admin/campus/${campusA.id}/usuarios`)
      .set('Authorization', `Bearer ${campusAdminToken}`);

    expect(res.status).toBe(200);
  });

  it('campus_admin acessa campus errado → 403', async () => {
    const res = await request(app)
      .get(`/admin/campus/${campusB.id}/usuarios`)
      .set('Authorization', `Bearer ${campusAdminToken}`);

    expect(res.status).toBe(403);
  });
});

import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Curso } from '../../src/entities/Curso';
import { Usuario } from '../../src/entities/Usuario';
import { createAdminUser, createCurso } from '../helpers/factories';

let app: import('express').Express;
let adminToken: string;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  const mod = await import('../../src/app');
  app = mod.app;

  // Limpa banco
  await TestDataSource.getRepository(Curso).clear();
  await TestDataSource.getRepository(Usuario).clear();

  // Cria um admin para rotas protegidas
  const admin = await createAdminUser(TestDataSource);
  const loginRes = await request(app)
    .post('/auth')
    .send({ email: admin.email, senha: 'admin123' });
  adminToken = loginRes.body.token;
});

// Teardown gerenciado pelo globalTeardown.ts — não destruir aqui

describe('Rotas de Curso (/curso)', () => {
  let cursoCriadoId: number;

  it('POST /curso — deve criar um curso com sucesso (admin)', async () => {
    const res = await request(app)
      .post('/curso')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'Engenharia de Software' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Engenharia de Software');
    cursoCriadoId = res.body.id;
  });

  it('POST /curso — deve rejeitar criar sem nome', async () => {
    const res = await request(app)
      .post('/curso')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({}); // sem nome

    expect(res.status).toBe(400);
  });

  it('GET /curso — deve listar os cursos (público)', async () => {
    // Cria mais um curso usando factory
    await createCurso(TestDataSource, 'Medicina');

    const res = await request(app).get('/curso');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('PUT /curso/:id — deve atualizar o curso (admin)', async () => {
    const res = await request(app)
      .put(`/curso/${cursoCriadoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nome: 'Engenharia de Software Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Engenharia de Software Atualizado');
  });

  it('DELETE /curso/:id — deve deletar o curso (admin)', async () => {
    const res = await request(app)
      .delete(`/curso/${cursoCriadoId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    // Verifica se realmente excluiu
    const verify = await request(app).get(`/curso/${cursoCriadoId}`);
    expect(verify.status).toBe(404);
  });
});

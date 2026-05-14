import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Categoria } from '../../src/entities/Categoria';
import { Curso } from '../../src/entities/Curso';
import { Usuario } from '../../src/entities/Usuario';
import { createAdminUser, createCurso, createCategoria } from '../helpers/factories';

let app: import('express').Express;
let adminToken: string;
let cursoAId: number;
let cursoBId: number;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  const mod = await import('../../src/app');
  app = mod.app;

  await TestDataSource.getRepository(Categoria).clear();
  await TestDataSource.getRepository(Curso).clear();
  await TestDataSource.getRepository(Usuario).clear();

  const admin = await createAdminUser(TestDataSource);
  const loginRes = await request(app)
    .post('/auth')
    .send({ email: admin.email, senha: 'admin123' });
  adminToken = loginRes.body.token;

  // Criar cursos base
  const cursoA = await createCurso(TestDataSource, 'Curso A');
  const cursoB = await createCurso(TestDataSource, 'Curso B');
  cursoAId = cursoA.id;
  cursoBId = cursoB.id;
});

// Teardown gerenciado pelo globalTeardown.ts — não destruir aqui

describe('Rotas de Categoria (/categorias)', () => {
  let categoriaId: number;

  it('POST /categorias — deve criar categoria vinculada ao curso', async () => {
    const res = await request(app)
      .post('/categorias')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ descricao: 'Lógica de Programação', cursoid: cursoAId });

    expect(res.status).toBe(201);
    expect(res.body.descricao).toBe('Lógica de Programação');
    expect(res.body.cursoid).toBe(cursoAId);
    categoriaId = res.body.id;
  });

  it('GET /categorias — lista todas (público)', async () => {
    const res = await request(app).get('/categorias');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /categorias/curso/:cursoId — filtra por curso', async () => {
    await createCategoria(TestDataSource, cursoBId, 'Matemática Aplicada');

    const resA = await request(app).get(`/categorias/curso/${cursoAId}`);
    expect(resA.status).toBe(200);
    expect(resA.body[0].descricao).toBe('Lógica de Programação');

    const resB = await request(app).get(`/categorias/curso/${cursoBId}`);
    expect(resB.status).toBe(200);
    expect(resB.body[0].descricao).toBe('Matemática Aplicada');
  });

  it('PUT /categorias/:id — deve atualizar categoria', async () => {
    const res = await request(app)
      .put(`/categorias/${categoriaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ descricao: 'Lógica 2.0', cursoid: cursoAId });

    expect(res.status).toBe(200);
    expect(res.body.descricao).toBe('Lógica 2.0');
  });

  it('DELETE /categorias/:id — deve remover', async () => {
    const res = await request(app)
      .delete(`/categorias/${categoriaId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });
});

/**
 * Testes de integração: Rotas de Alternativas (/alternativas)
 *
 * Cenários cobertos:
 * - GET  /alternativas/pergunta/:id    → lista por pergunta (público)
 * - POST /alternativas                 → criar (admin) / 401 / 403
 * - POST /alternativas (inválido)      → 400 sem perguntasid
 * - PUT  /alternativas/:id             → editar (admin)
 * - DELETE /alternativas/:id           → remover (admin)
 */

import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Alternativa  } from '../../src/entities/Alternativa';
import { Pergunta     } from '../../src/entities/Pergunta';
import { Categoria    } from '../../src/entities/Categoria';
import { PerguntaNivel} from '../../src/entities/PerguntaNivel';
import { Curso        } from '../../src/entities/Curso';
import { Usuario      } from '../../src/entities/Usuario';
import {
  createAdminUser, createUser,
  createCurso, createCategoria, createPerguntaNivel, createPergunta,
} from '../helpers/factories';

let app: import('express').Express;
let adminToken: string;
let playerToken: string;
let perguntaId: number;

beforeAll(async () => {
  process.env.NODE_ENV   = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) await TestDataSource.initialize();

  const mod = await import('../../src/app');
  app = mod.app;

  // Limpa tabelas dependentes em ordem correta
  await TestDataSource.getRepository(Alternativa).clear();
  await TestDataSource.getRepository(Pergunta).clear();
  await TestDataSource.getRepository(Categoria).clear();
  await TestDataSource.getRepository(PerguntaNivel).clear();
  await TestDataSource.getRepository(Curso).clear();
  await TestDataSource.getRepository(Usuario).clear();

  // Admin
  const admin = await createAdminUser(TestDataSource);
  const adminLogin = await request(app).post('/auth').send({ email: admin.email, senha: 'admin123' });
  adminToken = adminLogin.body.token as string;

  // Player
  const player = await createUser(TestDataSource, { email: `player.alt.${Date.now()}@mail.com`, senha: 'p123' });
  const playerLogin = await request(app).post('/auth').send({ email: player.email, senha: 'p123' });
  playerToken = playerLogin.body.token as string;

  // Cria estrutura base: curso → categoria → nível → pergunta
  const curso = await createCurso(TestDataSource, 'Curso Alt');
  const cat   = await createCategoria(TestDataSource, curso.id, 'Cat Alt');
  const nivel = await createPerguntaNivel(TestDataSource, 1, 10, 30);
  const perg  = await createPergunta(TestDataSource, cat.id, nivel.id, 'Pergunta para alternativas?');
  perguntaId  = perg.id;
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /alternativas/pergunta/:perguntaId — Listagem pública', () => {
  it('deve retornar lista de alternativas da pergunta (público)', async () => {
    // Insere uma alternativa diretamente no banco
    await TestDataSource.getRepository(Alternativa).save({
      perguntasid: perguntaId,
      conteudo: 'Alternativa pública',
      correta: false,
    });

    const res = await request(app).get(`/alternativas/pergunta/${perguntaId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('deve retornar lista vazia para pergunta sem alternativas', async () => {
    // Cria pergunta sem alternativas
    const curso2 = await createCurso(TestDataSource, 'Curso Alt2');
    const cat2   = await createCategoria(TestDataSource, curso2.id, 'Cat Alt2');
    const nivel2 = await createPerguntaNivel(TestDataSource, 2, 20, 60);
    const perg2  = await createPergunta(TestDataSource, cat2.id, nivel2.id, 'Sem alternativas?');

    const res = await request(app).get(`/alternativas/pergunta/${perg2.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /alternativas — Criação (admin)', () => {
  it('deve criar alternativa com sucesso (admin)', async () => {
    const res = await request(app)
      .post('/alternativas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ perguntasid: perguntaId, conteudo: 'Opção A', correta: true });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.conteudo).toBe('Opção A');
    expect(res.body.correta).toBe(true);
  });

  it('deve retornar 400 sem perguntasid', async () => {
    const res = await request(app)
      .post('/alternativas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ conteudo: 'Sem vínculo', correta: false });

    expect(res.status).toBe(400);
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app)
      .post('/alternativas')
      .send({ perguntasid: perguntaId, conteudo: 'X', correta: false });

    expect(res.status).toBe(401);
  });

  it('player não pode criar alternativa → 403', async () => {
    const res = await request(app)
      .post('/alternativas')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ perguntasid: perguntaId, conteudo: 'Hack', correta: true });

    expect(res.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PUT /alternativas/:id — Edição (admin)', () => {
  let altId: number;

  beforeAll(async () => {
    const alt = await TestDataSource.getRepository(Alternativa).save({
      perguntasid: perguntaId,
      conteudo: 'Para editar',
      correta: false,
    });
    altId = alt.id;
  });

  it('deve editar alternativa com sucesso (admin)', async () => {
    const res = await request(app)
      .put(`/alternativas/${altId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ conteudo: 'Editado', correta: true });

    expect(res.status).toBe(200);
    expect(res.body.conteudo).toBe('Editado');
  });

  it('player não pode editar alternativa → 403', async () => {
    const res = await request(app)
      .put(`/alternativas/${altId}`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ conteudo: 'Hack' });

    expect(res.status).toBe(403);
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app)
      .put(`/alternativas/${altId}`)
      .send({ conteudo: 'Sem auth' });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /alternativas/:id — Remoção (admin)', () => {
  let altId: number;

  beforeAll(async () => {
    const alt = await TestDataSource.getRepository(Alternativa).save({
      perguntasid: perguntaId,
      conteudo: 'Para remover',
      correta: false,
    });
    altId = alt.id;
  });

  it('player não pode deletar alternativa → 403', async () => {
    const res = await request(app)
      .delete(`/alternativas/${altId}`)
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.status).toBe(403);
  });

  it('deve deletar alternativa com sucesso (admin)', async () => {
    const res = await request(app)
      .delete(`/alternativas/${altId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  it('deve retornar 404 ao deletar alternativa já removida', async () => {
    const res = await request(app)
      .delete(`/alternativas/${altId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});

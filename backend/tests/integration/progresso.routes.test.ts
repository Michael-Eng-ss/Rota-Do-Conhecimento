/**
 * Testes de integração: Rotas de Progresso (/progresso-perguntas)
 *
 * Cenários cobertos:
 * - POST /progresso-perguntas                         → registrar (autenticado)
 * - POST /progresso-perguntas (sem auth)              → 401
 * - POST /progresso-perguntas (campos faltando)       → 400
 * - GET  /progresso-perguntas/quiz/:qId/usuario/:uId  → lista progresso (autenticado)
 * - GET  /progresso-perguntas/quiz... (sem auth)      → 401
 * - GET  /progresso-perguntas/categoria/:cId/quiz/:qId/usuario/:uId → filtro por categoria
 */

import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Alternativa  } from '../../src/entities/Alternativa';
import { Pergunta     } from '../../src/entities/Pergunta';
import { Categoria    } from '../../src/entities/Categoria';
import { PerguntaNivel} from '../../src/entities/PerguntaNivel';
import { Curso        } from '../../src/entities/Curso';
import { Usuario      } from '../../src/entities/Usuario';
import { Progresso    } from '../../src/entities/Progresso';
import {
  createUser,
  createCurso, createCategoria, createPerguntaNivel, createPergunta,
} from '../helpers/factories';

let app: import('express').Express;
let playerToken: string;
let playerId: number;
let perguntaId: number;
let pergunta2Id: number;
let categoriaId: number;
let categoria2Id: number;
const QUIZ_ID = 1; // simulado — não há entidade Quiz nesta suite

beforeAll(async () => {
  process.env.NODE_ENV   = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) await TestDataSource.initialize();

  const mod = await import('../../src/app');
  app = mod.app;

  // Limpa em ordem para evitar FK errors
  await TestDataSource.getRepository(Progresso).clear();
  await TestDataSource.getRepository(Alternativa).clear();
  await TestDataSource.getRepository(Pergunta).clear();
  await TestDataSource.getRepository(Categoria).clear();
  await TestDataSource.getRepository(PerguntaNivel).clear();
  await TestDataSource.getRepository(Curso).clear();
  await TestDataSource.getRepository(Usuario).clear();

  // Player autenticado
  const player = await createUser(TestDataSource, {
    email: `player.prog.${Date.now()}@mail.com`,
    senha: 'prog123',
  });
  playerId = player.id;
  const loginRes = await request(app)
    .post('/auth')
    .send({ email: player.email, senha: 'prog123' });
  playerToken = loginRes.body.token as string;

  // Estrutura: curso → 2 categorias → nível → 2 perguntas
  const curso   = await createCurso(TestDataSource, 'Curso Prog');
  const cat1    = await createCategoria(TestDataSource, curso.id, 'Cat 1');
  const cat2    = await createCategoria(TestDataSource, curso.id, 'Cat 2');
  const nivel   = await createPerguntaNivel(TestDataSource, 1, 10, 30);
  const perg1   = await createPergunta(TestDataSource, cat1.id, nivel.id, 'P1?');
  const perg2   = await createPergunta(TestDataSource, cat2.id, nivel.id, 'P2?');

  categoriaId  = cat1.id;
  categoria2Id = cat2.id;
  perguntaId   = perg1.id;
  pergunta2Id  = perg2.id;
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /progresso-perguntas — Registro de progresso', () => {
  it('deve registrar progresso com sucesso (player autenticado)', async () => {
    const res = await request(app)
      .post('/progresso-perguntas')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ usuariosid: playerId, perguntasid: perguntaId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.usuariosid).toBe(playerId);
    expect(res.body.perguntasid).toBe(perguntaId);
  });

  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app)
      .post('/progresso-perguntas')
      .send({ usuariosid: playerId, perguntasid: perguntaId });

    expect(res.status).toBe(401);
  });

  it('deve retornar 400 sem usuariosid', async () => {
    const res = await request(app)
      .post('/progresso-perguntas')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ perguntasid: perguntaId });

    expect(res.status).toBe(400);
  });

  it('deve retornar 400 sem perguntasid', async () => {
    const res = await request(app)
      .post('/progresso-perguntas')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ usuariosid: playerId });

    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /progresso-perguntas/quiz/:quizId/usuario/:userId', () => {
  beforeAll(async () => {
    // Garante que existe pelo menos um registro de progresso para a pergunta2
    await TestDataSource.getRepository(Progresso).save({
      usuariosid: playerId,
      perguntasid: pergunta2Id,
    });
  });

  it('deve retornar progresso do usuário para o quiz (autenticado)', async () => {
    const res = await request(app)
      .get(`/progresso-perguntas/quiz/${QUIZ_ID}/usuario/${playerId}`)
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app)
      .get(`/progresso-perguntas/quiz/${QUIZ_ID}/usuario/${playerId}`);

    expect(res.status).toBe(401);
  });

  it('deve retornar lista vazia para quiz sem progresso', async () => {
    const res = await request(app)
      .get(`/progresso-perguntas/quiz/999/usuario/${playerId}`)
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /progresso-perguntas/categoria/:catId/quiz/:quizId/usuario/:userId', () => {
  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app)
      .get(`/progresso-perguntas/categoria/${categoriaId}/quiz/${QUIZ_ID}/usuario/${playerId}`);

    expect(res.status).toBe(401);
  });

  it('deve retornar progresso filtrado por categoria (autenticado)', async () => {
    const res = await request(app)
      .get(`/progresso-perguntas/categoria/${categoriaId}/quiz/${QUIZ_ID}/usuario/${playerId}`)
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve retornar lista vazia para categoria sem progresso', async () => {
    const res = await request(app)
      .get(`/progresso-perguntas/categoria/999999/quiz/${QUIZ_ID}/usuario/${playerId}`)
      .set('Authorization', `Bearer ${playerToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

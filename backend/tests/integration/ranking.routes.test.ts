/**
 * Testes de integração: Rotas de Ranking (/ranking)
 *
 * Cenários cobertos:
 * - GET /ranking                      → ranking global (público)
 * - GET /ranking?limit=N              → respeita parâmetro de limite
 * - GET /ranking/curso/:cursoId       → ranking por curso (público)
 * - GET /ranking/campus/:campusId     → ranking por campus (público)
 * - Verifica campo 'position' sequencial
 * - Verifica que senha nunca aparece
 */

import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Usuario } from '../../src/entities/Usuario';
import { Campus  } from '../../src/entities/Campus';
import { Curso   } from '../../src/entities/Curso';
import { createUser, createCampus, createCurso } from '../helpers/factories';

let app: import('express').Express;
let cursoId: number;
let campusId: number;

beforeAll(async () => {
  process.env.NODE_ENV   = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) await TestDataSource.initialize();

  const mod = await import('../../src/app');
  app = mod.app;

  await TestDataSource.getRepository(Usuario).clear();
  await TestDataSource.getRepository(Campus).clear();
  await TestDataSource.getRepository(Curso).clear();

  // Cria curso e campus de referência
  const curso  = await createCurso(TestDataSource,  'Curso Ranking');
  const campus = await createCampus(TestDataSource, 'Campus Ranking');
  cursoId  = curso.id;
  campusId = campus.id;

  // Cria jogadores com pontuações diferentes
  await createUser(TestDataSource, { email: `rank1.${Date.now()}@r.com`, pontuacao: 300, cursoId, campusId });
  await createUser(TestDataSource, { email: `rank2.${Date.now()}@r.com`, pontuacao: 200, cursoId, campusId });
  await createUser(TestDataSource, { email: `rank3.${Date.now()}@r.com`, pontuacao: 100, cursoId, campusId });
  // Jogador sem curso/campus — só aparece no global
  await createUser(TestDataSource, { email: `rankX.${Date.now()}@r.com`, pontuacao: 50 });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /ranking — Ranking global', () => {
  it('deve retornar ranking global sem autenticação', async () => {
    const res = await request(app).get('/ranking');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
  });

  it('deve ter campo position sequencial a partir de 1', async () => {
    const res = await request(app).get('/ranking');
    expect(res.status).toBe(200);
    const positions: number[] = res.body.map((e: { position: number }) => e.position);
    positions.forEach((pos, i) => expect(pos).toBe(i + 1));
  });

  it('deve ordenar por pontuação decrescente', async () => {
    const res = await request(app).get('/ranking');
    expect(res.status).toBe(200);
    const pontuacoes: number[] = res.body.map((e: { pontuacao: number }) => e.pontuacao);
    for (let i = 0; i < pontuacoes.length - 1; i++) {
      expect(pontuacoes[i]).toBeGreaterThanOrEqual(pontuacoes[i + 1]);
    }
  });

  it('nunca deve retornar o campo senha', async () => {
    const res = await request(app).get('/ranking');
    res.body.forEach((entry: object) => {
      expect(entry).not.toHaveProperty('senha');
    });
  });

  it('deve retornar campos obrigatórios do ranking', async () => {
    const res = await request(app).get('/ranking');
    expect(res.status).toBe(200);
    const first = res.body[0];
    expect(first).toHaveProperty('position');
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('nome');
    expect(first).toHaveProperty('pontuacao');
  });

  it('deve respeitar o parâmetro limit=2', async () => {
    const res = await request(app).get('/ranking?limit=2');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /ranking/curso/:cursoId — Ranking por curso', () => {
  it('deve retornar apenas jogadores do curso informado', async () => {
    const res = await request(app).get(`/ranking/curso/${cursoId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3); // 3 jogadores com cursoId
  });

  it('deve ter position sequencial', async () => {
    const res = await request(app).get(`/ranking/curso/${cursoId}`);
    res.body.forEach((entry: { position: number }, i: number) => {
      expect(entry.position).toBe(i + 1);
    });
  });

  it('deve retornar lista vazia para curso sem jogadores', async () => {
    const res = await request(app).get('/ranking/curso/999999');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /ranking/campus/:campusId — Ranking por campus', () => {
  it('deve retornar apenas jogadores do campus informado', async () => {
    const res = await request(app).get(`/ranking/campus/${campusId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3); // 3 jogadores com campusId
  });

  it('deve ter position sequencial', async () => {
    const res = await request(app).get(`/ranking/campus/${campusId}`);
    res.body.forEach((entry: { position: number }, i: number) => {
      expect(entry.position).toBe(i + 1);
    });
  });

  it('deve retornar lista vazia para campus sem jogadores', async () => {
    const res = await request(app).get('/ranking/campus/999999');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

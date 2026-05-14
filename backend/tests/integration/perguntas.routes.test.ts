import request from 'supertest';
import { TestDataSource } from '../../src/config/data-source';
import { Pergunta } from '../../src/entities/Pergunta';
import { Alternativa } from '../../src/entities/Alternativa';
import { Categoria } from '../../src/entities/Categoria';
import { PerguntaNivel } from '../../src/entities/PerguntaNivel';
import { Curso } from '../../src/entities/Curso';
import { Usuario } from '../../src/entities/Usuario';
import { 
  createAdminUser, 
  createCurso, 
  createCategoria, 
  createPerguntaNivel,
  createPergunta
} from '../helpers/factories';

let app: import('express').Express;
let adminToken: string;
let categoriaId: number;
let nivelId: number;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_jest';

  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  const mod = await import('../../src/app');
  app = mod.app;

  // Limpa tudo
  await TestDataSource.getRepository(Alternativa).clear();
  await TestDataSource.getRepository(Pergunta).clear();
  await TestDataSource.getRepository(Categoria).clear();
  await TestDataSource.getRepository(PerguntaNivel).clear();
  await TestDataSource.getRepository(Curso).clear();
  await TestDataSource.getRepository(Usuario).clear();

  const admin = await createAdminUser(TestDataSource);
  const loginRes = await request(app)
    .post('/auth')
    .send({ email: admin.email, senha: 'admin123' });
  adminToken = loginRes.body.token;

  const curso = await createCurso(TestDataSource, 'Curso Z');
  const cat = await createCategoria(TestDataSource, curso.id, 'Categoria Z');
  categoriaId = cat.id;

  const nivel = await createPerguntaNivel(TestDataSource, 1, 10, 30);
  nivelId = nivel.id;
});

// Teardown gerenciado pelo globalTeardown.ts — não destruir aqui

describe('Rotas de Pergunta (/perguntas)', () => {
  let perguntaId: number;

  it('POST /perguntas — criar pergunta válida (admin)', async () => {
    const res = await request(app)
      .post('/perguntas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        conteudo: 'Quanto é 2 + 2?',
        categoriasid: categoriaId,
        perguntasnivelid: nivelId
      });

    expect(res.status).toBe(201);
    expect(res.body.conteudo).toBe('Quanto é 2 + 2?');
    perguntaId = res.body.id;
  });

  it('GET /perguntas/todas — lista todas (público)', async () => {
    await createPergunta(TestDataSource, categoriaId, nivelId, 'Outra pergunta');

    const res = await request(app).get('/perguntas/todas');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET /perguntas/completas/:categoriaId — deve trazer as alternativas embutidas', async () => {
    // Vamos adicionar uma alternativa à pergunta criada
    await TestDataSource.getRepository(Alternativa).save({
      perguntasid: perguntaId,
      conteudo: '4',
      correta: true
    });

    const res = await request(app).get(`/perguntas/completas/${categoriaId}`);
    expect(res.status).toBe(200);
    
    // As perguntas retornadas devem ser da categoria solicitada
    const perguntaCompleta = res.body.find((p: any) => p.id === perguntaId);
    expect(perguntaCompleta).toBeDefined();
    expect(perguntaCompleta.alternativas).toBeDefined();
    expect(perguntaCompleta.alternativas.length).toBeGreaterThan(0);
    expect(perguntaCompleta.alternativas[0].conteudo).toBe('4');
  });

  it('PUT /perguntas/:id — deve editar', async () => {
    const res = await request(app)
      .put(`/perguntas/${perguntaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ conteudo: 'Editado' });

    expect(res.status).toBe(200);
    expect(res.body.conteudo).toBe('Editado');
  });

  it('DELETE /perguntas/:id — deve remover', async () => {
    const res = await request(app)
      .delete(`/perguntas/${perguntaId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });
});

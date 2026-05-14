import { ProgressoService } from '../../../src/services/ProgressoService';
import { ProgressoRepository } from '../../../src/repositories/ProgressoRepository';
import { PerguntaRepository } from '../../../src/repositories/PerguntaRepository';
import { AppError } from '../../../src/shared/AppError';

// ── Mocks ─────────────────────────────────────────────────────────────────
jest.mock('../../../src/repositories/ProgressoRepository');
jest.mock('../../../src/repositories/PerguntaRepository');

const MockProgressoRepo = ProgressoRepository as jest.MockedClass<typeof ProgressoRepository>;
const MockPerguntaRepo  = PerguntaRepository  as jest.MockedClass<typeof PerguntaRepository>;

const fakeProgresso = (id = 1, usuariosid = 10, perguntasid = 5) =>
  ({ id, usuariosid, perguntasid });

const fakePergunta = (id: number, quizid: number, categoriasid = 1) =>
  ({ id, quizid, categoriasid, conteudo: `Pergunta ${id}`, status: true, tempo: 30 });

// ═══════════════════════════════════════════════════════════════════════════
describe('ProgressoService.getByUsuario()', () => {
  let service: ProgressoService;
  let mockRepo: jest.Mocked<ProgressoRepository>;

  beforeEach(() => {
    MockProgressoRepo.mockClear();
    MockPerguntaRepo.mockClear();
    service  = new ProgressoService({} as never);
    mockRepo = MockProgressoRepo.mock.instances[0] as jest.Mocked<ProgressoRepository>;
  });

  it('deve retornar lista de progressos do usuário', async () => {
    mockRepo.findByUsuario.mockResolvedValue([fakeProgresso(1, 10, 5), fakeProgresso(2, 10, 6)] as never);
    const result = await service.getByUsuario(10);
    expect(result).toHaveLength(2);
    expect(mockRepo.findByUsuario).toHaveBeenCalledWith(10);
  });

  it('deve retornar lista vazia se usuário não tiver progresso', async () => {
    mockRepo.findByUsuario.mockResolvedValue([]);
    const result = await service.getByUsuario(99);
    expect(result).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('ProgressoService.getByQuizAndUsuario()', () => {
  let service: ProgressoService;
  let mockRepo: jest.Mocked<ProgressoRepository>;
  let mockPerguntaRepo: jest.Mocked<PerguntaRepository>;

  beforeEach(() => {
    MockProgressoRepo.mockClear();
    MockPerguntaRepo.mockClear();
    service          = new ProgressoService({} as never);
    mockRepo         = MockProgressoRepo.mock.instances[0] as jest.Mocked<ProgressoRepository>;
    mockPerguntaRepo = MockPerguntaRepo.mock.instances[0]  as jest.Mocked<PerguntaRepository>;
  });

  it('deve retornar lista vazia se quiz não tiver perguntas', async () => {
    mockPerguntaRepo.findAll.mockResolvedValue([]);
    const result = await service.getByQuizAndUsuario(1, 10);
    expect(result).toEqual([]);
    expect(mockRepo.findByQuizAndUsuario).not.toHaveBeenCalled();
  });

  it('deve buscar progresso apenas com perguntas do quiz correto', async () => {
    mockPerguntaRepo.findAll.mockResolvedValue([
      fakePergunta(1, 5),
      fakePergunta(2, 5),
      fakePergunta(3, 9), // outro quiz, deve ser ignorado
    ] as never);
    mockRepo.findByQuizAndUsuario.mockResolvedValue([fakeProgresso()] as never);

    await service.getByQuizAndUsuario(5, 10);

    expect(mockRepo.findByQuizAndUsuario).toHaveBeenCalledWith([1, 2], 10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('ProgressoService.getByCategQuizAndUsuario()', () => {
  let service: ProgressoService;
  let mockRepo: jest.Mocked<ProgressoRepository>;
  let mockPerguntaRepo: jest.Mocked<PerguntaRepository>;

  beforeEach(() => {
    MockProgressoRepo.mockClear();
    MockPerguntaRepo.mockClear();
    service          = new ProgressoService({} as never);
    mockRepo         = MockProgressoRepo.mock.instances[0] as jest.Mocked<ProgressoRepository>;
    mockPerguntaRepo = MockPerguntaRepo.mock.instances[0]  as jest.Mocked<PerguntaRepository>;
  });

  it('deve retornar vazio se não houver perguntas para a categoria/quiz', async () => {
    mockPerguntaRepo.findAll.mockResolvedValue([fakePergunta(1, 5, 2)] as never); // categoria 2
    const result = await service.getByCategQuizAndUsuario(1, 5, 10); // busca categoria 1
    expect(result).toEqual([]);
  });

  it('deve filtrar por categoria e quiz corretamente', async () => {
    mockPerguntaRepo.findAll.mockResolvedValue([
      fakePergunta(1, 5, 1),
      fakePergunta(2, 5, 1),
      fakePergunta(3, 5, 2), // categoria diferente
    ] as never);
    mockRepo.findByQuizAndUsuario.mockResolvedValue([fakeProgresso()] as never);

    await service.getByCategQuizAndUsuario(1, 5, 10);

    expect(mockRepo.findByQuizAndUsuario).toHaveBeenCalledWith([1, 2], 10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('ProgressoService.create()', () => {
  let service: ProgressoService;
  let mockRepo: jest.Mocked<ProgressoRepository>;

  beforeEach(() => {
    MockProgressoRepo.mockClear();
    MockPerguntaRepo.mockClear();
    service  = new ProgressoService({} as never);
    mockRepo = MockProgressoRepo.mock.instances[0] as jest.Mocked<ProgressoRepository>;
  });

  it('deve lançar 400 se usuariosid não for fornecido', () => {
    expect(() => service.create({ perguntasid: 1 })).toThrow(AppError);
    expect(() => service.create({ perguntasid: 1 })).toThrow('ID do usuário é obrigatório');
  });

  it('deve lançar 400 se perguntasid não for fornecido', () => {
    expect(() => service.create({ usuariosid: 1 })).toThrow(AppError);
    expect(() => service.create({ usuariosid: 1 })).toThrow('ID da pergunta é obrigatório');
  });

  it('deve criar progresso com sucesso', async () => {
    mockRepo.create.mockResolvedValue(fakeProgresso() as never);
    const result = await service.create({ usuariosid: 10, perguntasid: 5 });
    expect(result.id).toBe(1);
    expect(result.usuariosid).toBe(10);
  });
});

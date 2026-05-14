/**
 * Testes unitários para EmailService
 * Cobrindo: modo DEV (sem SMTP), sendPasswordReset, sendEmailVerification, sendWelcome
 */
import { EmailService } from '../../../src/services/EmailService';

// ─────────────────────────────────────────────────────────────────────────────
// Garante que o EmailService sempre inicia em modo DEV (sem SMTP real)
beforeAll(() => {
  delete process.env.SMTP_HOST;
  delete process.env.EMAIL_HOST;
});

// ═══════════════════════════════════════════════════════════════════════════
describe('EmailService — modo DEV (sem SMTP)', () => {
  let service: EmailService;
  let consoleSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logSpy     = jest.spyOn(console, 'log').mockImplementation(() => {});
    service    = new EmailService();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('deve logar aviso ao iniciar sem SMTP configurado', () => {
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('SMTP_HOST não configurado'),
    );
  });

  it('sendPasswordReset deve logar link de recuperação (não lança erro)', async () => {
    await expect(
      service.sendPasswordReset('user@mail.com', 'Usuário', 'tok-reset-abc'),
    ).resolves.not.toThrow();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('tok-reset-abc'),
    );
  });

  it('sendEmailVerification deve logar link de verificação (não lança erro)', async () => {
    await expect(
      service.sendEmailVerification('user@mail.com', 'Usuário', 'tok-verify-xyz'),
    ).resolves.not.toThrow();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('tok-verify-xyz'),
    );
  });

  it('sendWelcome deve interceptar o e-mail e logar (não lança erro)', async () => {
    await expect(
      service.sendWelcome('user@mail.com', 'Usuário'),
    ).resolves.not.toThrow();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('[DEV MODE] E-MAIL INTERCEPTADO'),
    );
  });

  it('sendPasswordReset não deve lançar mesmo com token vazio', async () => {
    await expect(
      service.sendPasswordReset('x@x.com', 'X', ''),
    ).resolves.not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe('EmailService — formato do link gerado (DEV)', () => {
  let service: EmailService;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    logSpy  = jest.spyOn(console, 'log').mockImplementation(() => {});
    service = new EmailService();
  });

  afterEach(() => jest.restoreAllMocks());

  it('link de reset deve conter /nova-senha?token=', async () => {
    await service.sendPasswordReset('a@a.com', 'A', 'meu-token-reset');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('/nova-senha?token=meu-token-reset'),
    );
  });

  it('link de verificação deve conter /verificar-email?token=', async () => {
    await service.sendEmailVerification('a@a.com', 'A', 'meu-token-verify');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('/verificar-email?token=meu-token-verify'),
    );
  });
});

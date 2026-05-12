import * as nodemailer from 'nodemailer';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevMode: boolean;

  constructor() {
    this.isDevMode = !process.env.SMTP_HOST;

    if (!this.isDevMode) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      console.warn('[EmailService] SMTP_HOST não configurado. O serviço funcionará em modo DEV (apenas logs).');
    }
  }

  /**
   * Template base para todos os e-mails, garantindo um design consistente e responsivo.
   */
  private getBaseTemplate(content: string): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #6c63ff; margin: 0;">Rota do Conhecimento</h1>
        </div>
        <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          ${content}
        </div>
        <div style="text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Rota do Conhecimento. Todos os direitos reservados.</p>
          <p>Este é um e-mail automático, por favor não responda.</p>
        </div>
      </div>
    `;
  }

  /**
   * Envia o e-mail usando o transporter ou apenas loga no console em ambiente local.
   */
  private async sendMail(options: nodemailer.SendMailOptions): Promise<void> {
    if (this.isDevMode || !this.transporter) {
      console.log('--- [DEV MODE] E-MAIL INTERCEPTADO ---');
      console.log(`Para: ${options.to}`);
      console.log(`Assunto: ${options.subject}`);
      console.log('Conteúdo HTML omitido (verifique o link se houver).');
      console.log('----------------------------------------');
      return;
    }

    try {
      options.from = options.from || `"Rota do Conhecimento" <${process.env.SMTP_USER}>`;
      await this.transporter.sendMail(options);
    } catch (error) {
      console.error('[EmailService] Falha ao enviar e-mail:', error);
      // Aqui poderíamos lançar um AppError, mas falhas de e-mail geralmente 
      // não devem travar o fluxo principal (ex: o usuário foi criado de qualquer forma)
    }
  }

  async sendPasswordReset(email: string, nome: string, token: string): Promise<void> {
    const link = `${FRONTEND_URL}/nova-senha?token=${token}`;

    if (this.isDevMode) {
      console.log(`[DEV MODE] Link de recuperação de senha gerado: ${link}`);
    }

    const htmlContent = `
      <h2 style="color: #1f2937; margin-top: 0;">Olá, ${nome}!</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Recebemos uma solicitação para redefinir a senha da sua conta.</p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Clique no botão abaixo para criar uma nova senha. Por motivos de segurança, este link expira em <strong>1 hora</strong>.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="display: inline-block; padding: 14px 28px; background-color: #6c63ff; color: #ffffff; font-weight: bold; border-radius: 6px; text-decoration: none; letter-spacing: 0.5px;">
          Redefinir Minha Senha
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">Se você não solicitou a redefinição, apenas ignore este e-mail. Nenhuma alteração será feita na sua conta.</p>
    `;

    await this.sendMail({
      to: email,
      subject: 'Recuperação de Senha — Rota do Conhecimento 🔐',
      html: this.getBaseTemplate(htmlContent),
    });
  }

  async sendWelcome(email: string, nome: string): Promise<void> {
    const htmlContent = `
      <h2 style="color: #1f2937; margin-top: 0;">Bem-vindo(a), ${nome}! 🎉</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso.</p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Acesse a plataforma e comece agora mesmo a sua jornada de aprendizado e desafios.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${FRONTEND_URL}" style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff; font-weight: bold; border-radius: 6px; text-decoration: none; letter-spacing: 0.5px;">
          Acessar o Jogo
        </a>
      </div>
    `;

    await this.sendMail({
      to: email,
      subject: 'Bem-vindo(a) ao Rota do Conhecimento! 🚀',
      html: this.getBaseTemplate(htmlContent),
    });
  }
}

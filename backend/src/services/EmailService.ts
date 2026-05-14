import * as nodemailer from 'nodemailer';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevMode: boolean;

  constructor() {
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const port = process.env.SMTP_PORT || process.env.EMAIL_PORT || '587';
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const secure = process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true';

    this.isDevMode = !host;

    if (!this.isDevMode) {
      this.transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(port),
        secure: secure,
        auth: {
          user: user,
          pass: pass,
        },
      });

      // Verifica conectividade SMTP na inicialização para detectar problemas cedo
      this.transporter.verify().then(() => {
        console.info('[EmailService] Conexão SMTP verificada com sucesso.');
      }).catch((err: Error) => {
        console.error('[EmailService] FALHA na verificação SMTP. Verifique SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS.', err.message);
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
      const user = process.env.SMTP_USER || process.env.EMAIL_USER;
      options.from    = options.from    || `"Rota do Conhecimento" <${user}>`;
      options.replyTo = options.replyTo || `"Rota do Conhecimento" <${user}>`;

      // Cabeçalhos para melhorar entregabilidade e evitar filtros de spam
      options.headers = {
        'X-Mailer': 'Rota-do-Conhecimento-Mailer/1.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
        'List-Unsubscribe': `<mailto:${user}?subject=unsubscribe>`,
        'Precedence': 'bulk',
      };

      await this.transporter.sendMail(options);
      console.info(`[EmailService] ✅ E-mail enviado com sucesso para: ${options.to} | Assunto: ${options.subject}`);
    } catch (error) {
      console.error('[EmailService] Falha ao enviar e-mail:', error);
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

  async sendEmailVerification(email: string, nome: string, token: string): Promise<void> {
    const link = `${FRONTEND_URL}/verificar-email?token=${token}`;

    if (this.isDevMode) {
      console.log(`[DEV MODE] Link de verificação de e-mail gerado: ${link}`);
    }

    const htmlContent = `
      <h2 style="color: #1f2937; margin-top: 0;">Olá, ${nome}! Bem-vindo(a) ao Rota do Conhecimento! 🎉</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Para começar a sua jornada e liberar o seu acesso ao jogo, precisamos que você confirme o seu endereço de e-mail.</p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Clique no botão abaixo para ativar a sua conta. Este link expira em <strong>24 horas</strong>.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff; font-weight: bold; border-radius: 6px; text-decoration: none; letter-spacing: 0.5px;">
          Confirmar meu E-mail
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">Se você não realizou este cadastro, apenas ignore este e-mail.</p>
    `;

    await this.sendMail({
      to: email,
      subject: 'Confirme seu e-mail — Rota do Conhecimento 📩',
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

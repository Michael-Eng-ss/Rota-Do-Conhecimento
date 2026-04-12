const nodemailer = require('nodemailer');
const dns = require('dns');

// FORÇAR o Node.js a ignorar o IPv6 completamente para evitar timeout do Render
dns.setDefaultResultOrder('ipv4first');

/** Cria o transporte SMTP a partir das variáveis de ambiente */
function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Força uso do 465 (SMTPS), bypassando o bloqueio de spam do Render
    family: 4, // 🔌 OBRIGA o servidor a criar o Socket TCP exclusivamente em IPv4
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Rota do Conhecimento';
const FROM_EMAIL = process.env.EMAIL_USER;

/**
 * Envia e-mail de confirmação de cadastro.
 * @param {string} toEmail
 * @param {string} nomeUsuario
 * @param {string} token
 */
async function sendEmailConfirmation(toEmail, nomeUsuario, token) {
  const link = `${FRONTEND_URL}/confirmar-email?token=${token}`;
  const transporter = createTransport();

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: 'Confirme seu cadastro – Rota do Conhecimento',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;background:#0f172a;color:#f8fafc;border-radius:12px;">
        <h2 style="color:#7c3aed;margin-bottom:8px;">🎮 Rota do Conhecimento</h2>
        <h3 style="margin-top:0;">Bem-vindo(a), ${nomeUsuario}!</h3>
        <p>Obrigado por se cadastrar. Para ativar sua conta, clique no botão abaixo:</p>
        <a href="${link}"
           style="display:inline-block;margin:16px 0;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          ✅ Confirmar E-mail
        </a>
        <p style="color:#94a3b8;font-size:13px;">Este link expira em 24 horas. Se você não criou esta conta, ignore este e-mail.</p>
        <hr style="border-color:#334155;margin:24px 0;">
        <p style="color:#64748b;font-size:12px;">Rota do Conhecimento • Sistema de Quiz Educacional</p>
      </div>
    `,
  });
}

/**
 * Envia e-mail de recuperação de senha.
 * @param {string} toEmail
 * @param {string} nomeUsuario
 * @param {string} token
 */
async function sendPasswordReset(toEmail, nomeUsuario, token) {
  const link = `${FRONTEND_URL}/nova-senha?token=${token}`;
  const transporter = createTransport();

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: 'Recuperação de senha – Rota do Conhecimento',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;background:#0f172a;color:#f8fafc;border-radius:12px;">
        <h2 style="color:#7c3aed;margin-bottom:8px;">🎮 Rota do Conhecimento</h2>
        <h3 style="margin-top:0;">Olá, ${nomeUsuario}!</h3>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:</p>
        <a href="${link}"
           style="display:inline-block;margin:16px 0;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          🔑 Redefinir Senha
        </a>
        <p style="color:#94a3b8;font-size:13px;">Este link expira em 1 hora. Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.</p>
        <hr style="border-color:#334155;margin:24px 0;">
        <p style="color:#64748b;font-size:12px;">Rota do Conhecimento • Sistema de Quiz Educacional</p>
      </div>
    `,
  });
}

module.exports = { sendEmailConfirmation, sendPasswordReset };

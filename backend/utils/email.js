import nodemailer from 'nodemailer';

const getEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && String(value).trim()) return String(value).trim();
  }
  return '';
};

const getClientUrl = () => {
  const explicit = getEnv('CLIENT_URL', 'FRONTEND_URL', 'APP_URL');
  if (explicit) return explicit.replace(/\/$/, '');
  return 'http://localhost:5173';
};

const createTransport = () => {
  const host = getEnv('SMTP_HOST', 'EMAIL_HOST', 'MAIL_HOST');
  const user = getEnv('SMTP_USER', 'EMAIL_USER', 'MAIL_USER');
  const pass = getEnv('SMTP_PASS', 'EMAIL_PASS', 'MAIL_PASS');
  const port = Number(getEnv('SMTP_PORT', 'EMAIL_PORT', 'MAIL_PORT') || 587);
  const secureEnv = getEnv('SMTP_SECURE', 'EMAIL_SECURE', 'MAIL_SECURE').toLowerCase();
  const secure = secureEnv ? secureEnv === 'true' : port === 465;

  if (!host || !user || !pass) {
    return { transporter: null, reason: 'Missing SMTP host/user/pass' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });

  return { transporter, reason: '' };
};

export const sendPasswordResetEmail = async ({ to, name, token, expiresInMinutes = 15 }) => {
  const resetLink = `${getClientUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const from =
    getEnv('SMTP_FROM', 'EMAIL_FROM', 'MAIL_FROM') ||
    getEnv('SMTP_USER', 'EMAIL_USER', 'MAIL_USER') ||
    'no-reply@4amglobalmedia.com';

  const subject = 'Reset your password';
  const text = [
    `Hi ${name || 'there'},`,
    '',
    'We received a request to reset your password.',
    `Use this link within ${expiresInMinutes} minutes:`,
    resetLink,
    '',
    'If you did not request this, you can ignore this email.'
  ].join('\n');

  const html = `
    <p>Hi ${name || 'there'},</p>
    <p>We received a request to reset your password.</p>
    <p>Use the link below within <strong>${expiresInMinutes} minutes</strong>:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  const { transporter, reason } = createTransport();
  if (!transporter) {
    const mode = (process.env.NODE_ENV || 'development').toLowerCase();
    if (mode !== 'production') {
      console.warn(`[email-disabled] ${reason}. Password reset email to ${to}: ${resetLink}`);
      return;
    }

    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and SMTP_FROM.');
  }

  await transporter.sendMail({ from, to, subject, text, html });
};

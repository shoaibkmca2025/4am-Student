import nodemailer from 'nodemailer';

const getClientUrl = () => {
  const explicit = process.env.CLIENT_URL || process.env.FRONTEND_URL || process.env.APP_URL;
  if (explicit && explicit.trim()) return explicit.trim().replace(/\/$/, '');
  return 'http://localhost:5173';
};

const createTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

export const sendPasswordResetEmail = async ({ to, name, token, expiresInMinutes = 15 }) => {
  const resetLink = `${getClientUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@4amglobalmedia.com';

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

  const transporter = createTransport();
  if (!transporter) {
    if ((process.env.NODE_ENV || 'development') !== 'production') {
      console.warn(`[email-disabled] Password reset email to ${to}: ${resetLink}`);
    }
    return;
  }

  await transporter.sendMail({ from, to, subject, text, html });
};

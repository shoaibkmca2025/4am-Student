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

const isValidFromValue = (value) => {
  if (!value) return false;
  // Accept either plain email or display name format: Name <email@domain>
  return /@/.test(value);
};

const createTransportCandidates = () => {
  const host = getEnv('SMTP_HOST', 'EMAIL_HOST', 'MAIL_HOST');
  const user = getEnv('SMTP_USER', 'SMTP_USERNAME', 'EMAIL_USER', 'MAIL_USER', 'GMAIL_USER', 'MAIL_USERNAME');
  const pass = getEnv('SMTP_PASS', 'SMTP_PASSWORD', 'EMAIL_PASS', 'MAIL_PASS', 'GMAIL_APP_PASSWORD', 'GOOGLE_APP_PASSWORD', 'APP_PASSWORD', 'MAIL_PASSWORD');
  const port = Number(getEnv('SMTP_PORT', 'EMAIL_PORT', 'MAIL_PORT') || 587);
  const secureEnv = getEnv('SMTP_SECURE', 'EMAIL_SECURE', 'MAIL_SECURE').toLowerCase();
  const secure = secureEnv ? secureEnv === 'true' : Number.isFinite(port) && port === 465;

  if (!user || !pass) {
    return { candidates: [], reason: 'Missing SMTP user/pass' };
  }

  const isGmailUser = /@gmail\.com$/i.test(user);
  const candidates = [];

  if (host) {
    candidates.push({
      name: `smtp:${host}:${Number.isFinite(port) ? port : 587}`,
      transporter: nodemailer.createTransport({
        host,
        port: Number.isFinite(port) ? port : 587,
        secure,
        auth: { user, pass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000
      })
    });
  }

  if (isGmailUser) {
    candidates.push({
      name: 'gmail-service',
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000
      })
    });

    candidates.push({
      name: 'gmail-smtp-587',
      transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user, pass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000
      })
    });

    candidates.push({
      name: 'gmail-smtp-465',
      transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000
      })
    });
  }

  if (!candidates.length) {
    return { candidates: [], reason: 'Missing SMTP host (or use a Gmail account with app password)' };
  }

  return { candidates, reason: '' };
};

export const sendPasswordResetEmail = async ({ to, name, token, expiresInMinutes = 15 }) => {
  const resetLink = `${getClientUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const configuredFrom = getEnv('SMTP_FROM', 'EMAIL_FROM', 'MAIL_FROM', 'MAILER_FROM');
  const authUser = getEnv('SMTP_USER', 'SMTP_USERNAME', 'EMAIL_USER', 'MAIL_USER', 'GMAIL_USER', 'MAIL_USERNAME');
  const appName = getEnv('APP_NAME', 'MAIL_APP_NAME', 'EMAIL_APP_NAME') || '4AM Student Platform';
  const from = isValidFromValue(configuredFrom)
    ? configuredFrom
    : (authUser ? `${appName} <${authUser}>` : 'no-reply@4amglobalmedia.com');

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

  const { candidates, reason } = createTransportCandidates();
  if (!candidates.length) {
    const mode = (process.env.NODE_ENV || 'development').toLowerCase();
    if (mode !== 'production') {
      console.warn(`[email-disabled] ${reason}. Password reset email to ${to}: ${resetLink}`);
      return;
    }

    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and SMTP_FROM.');
  }

  let lastError = null;
  for (const candidate of candidates) {
    try {
      const info = await candidate.transporter.sendMail({ from, to, subject, text, html });
      const accepted = Array.isArray(info?.accepted) ? info.accepted.map((item) => String(item).toLowerCase()) : [];
      const rejected = Array.isArray(info?.rejected) ? info.rejected.map((item) => String(item).toLowerCase()) : [];
      const target = String(to || '').toLowerCase();

      if (!accepted.length || rejected.includes(target)) {
        throw new Error(`SMTP did not accept recipient (${target}). response=${info?.response || 'n/a'}`);
      }

      return;
    } catch (err) {
      lastError = err;
      console.error(`[email-send-failed:${candidate.name}]`, err?.message || err);
    }
  }

  throw new Error(lastError?.message || 'All email transport attempts failed');
};

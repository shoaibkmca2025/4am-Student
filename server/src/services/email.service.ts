import { logger } from '../utils/logger';

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  // Stub: integrate with SendGrid, Resend, or Nodemailer
  logger.info(`[Email stub] Welcome email would be sent to ${email} (${name})`);
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  logger.info(`[Email stub] Password reset email would be sent to ${email} with token ${resetToken}`);
}

export async function sendApplicationStatusEmail(
  email: string,
  name: string,
  jobTitle: string,
  status: string
): Promise<void> {
  logger.info(
    `[Email stub] Application status email: ${name} (${email}) - Job: ${jobTitle} - Status: ${status}`
  );
}

import { Resend } from 'resend';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let resendClient;

function getResendClient() {
  if (resendClient) return resendClient;
  resendClient = new Resend(env.resend.apiKey);
  return resendClient;
}

export async function sendEmail({ to, subject, text, html }) {
  if (!env.resend.apiKey) {
    logger.warn({ to, subject, text }, 'Resend API key not configured, logging email instead of sending');
    return;
  }

  try {
    const { data, error } = await getResendClient().emails.send({
      from: env.resend.from,
      to,
      subject,
      text,
      html: html || `<p>${text.replace(/\n/g, '<br/>')}</p>`,
    });

    if (error) {
      logger.error({ error, to }, 'Resend failed to send email');
      return;
    }

    logger.info({ to, emailId: data?.id }, 'Email sent via Resend');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send email via Resend');
  }
}

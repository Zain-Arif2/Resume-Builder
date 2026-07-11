import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  if (!env.smtp.host || !env.smtp.user) {
    logger.warn({ to, subject, text }, 'SMTP not configured, logging email instead of sending');
    return;
  }

  try {
    await getTransporter().sendMail({ from: env.smtp.from, to, subject, text, html });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send email');
  }
}

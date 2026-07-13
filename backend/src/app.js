import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

import { env } from './config/env.js';
import { logger, httpLogger } from './config/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { paymentController } from './controllers/payment.controller.js';
import v1Routes from './routes/v1/index.js';

const app = express();

// ─── Security Middleware ───────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(mongoSanitize());
app.use(hpp());

// ─── Rate Limiting ──────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: env.rateLimit?.windowMs || 15 * 60 * 1000,
  max: env.rateLimit?.max || 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// ─── Stripe Webhook (MUST be registered before express.json — needs raw body) ─
app.post(
  `/api/${env.apiVersion}/payments/webhook`,
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// ─── Body Parsing ───────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// ─── Request Logging ────────────────────────────────────
app.use(
  pinoHttp({
    logger: httpLogger,
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    autoLogging: {
      ignore: (req) => req.url === '/health',
    },
  })
);

// ─── Health Check ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// ─── API Routes ─────────────────────────────────────────
app.use(`/api/${env.apiVersion}`, v1Routes);

// ─── 404 + Global Error Handler ─────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import v1Routes from './routes/v1/index.js';

import { env } from './config/env.js';
import { logger, httpLogger } from './config/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// ─── Security Middleware ───────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true, // HTTP-only cookies cross-origin bhejne ke liye zaroori
  })
);
app.use(mongoSanitize()); // NoSQL injection se bachao (e.g. { "$gt": "" })
app.use(hpp()); // HTTP Parameter Pollution se bachao

// ─── Rate Limiting ──────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: env.rateLimit?.windowMs || 15 * 60 * 1000,
  max: env.rateLimit?.max || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// ─── Body Parsing ───────────────────────────────────────
app.use(express.json({ limit: '50mb' })); // Increased to 50mb for PDF generation
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
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
      ignore: (req) => req.url === '/health', // health check spam na ho logs mein
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

// ─── API Routes (Phase 2+ mein add honge) ──────────────
app.use(`/api/${env.apiVersion}`, v1Routes);
// app.use(`/api/${env.apiVersion}/resumes`, resumeRoutes);

// ─── 404 + Global Error Handler ─────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
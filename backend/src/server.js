import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './config/logger.js';

let server;

async function startServer() {
  try {
    await connectDB();

    server = http.createServer(app);

    server.listen(env.port, () => {
      logger.info(`🚀 Server running in ${env.nodeEnv} mode on port ${env.port}`);
      logger.info(`📍 API base: http://localhost:${env.port}/api/${env.apiVersion}`);
    });
  } catch (error) {
    logger.error({ error }, '❌ Failed to start server');
    process.exit(1);
  }
}

// ─── Graceful Shutdown ─────────────────────────────────
async function shutdown(signal) {
  logger.warn(`${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });

    // Force exit agar 10 second mein clean shutdown na ho
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ─── Catch unhandled errors (safety net) ───────────────
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
  throw reason; // crash karke process manager (pm2/docker) ko restart karne do
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});

startServer();
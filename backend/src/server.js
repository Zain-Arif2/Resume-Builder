import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './config/logger.js';
import { closeBrowser } from './services/browser.service.js';

let server;

async function startServer() {
  try {
    await connectDB();

    server = http.createServer(app);

    server.listen(env.port, () => {
      logger.info(
        `🚀 Server running in ${env.nodeEnv} mode on port ${env.port}`
      );

      logger.info(
        `📍 API base: http://localhost:${env.port}/api/${env.apiVersion}`
      );
    });
  } catch (error) {
    logger.error({ error }, '❌ Failed to start server');
    process.exit(1);
  }
}

// ───────────────────────────────────────────────────────────
// Graceful Shutdown
// ───────────────────────────────────────────────────────────

async function shutdown(signal) {
  logger.warn(`${signal} received. Shutting down gracefully...`);

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.info('✅ HTTP server closed');
    }

    try {
      await closeBrowser();
      logger.info('✅ Puppeteer browser closed');
    } catch (error) {
      logger.error(
        { error },
        '❌ Failed to close Puppeteer browser'
      );
    }

    try {
      await disconnectDB();
      logger.info('✅ MongoDB disconnected');
    } catch (error) {
      logger.error(
        { error },
        '❌ Failed to disconnect MongoDB'
      );
    }

    process.exit(0);
  } catch (error) {
    logger.error(
      { error },
      '❌ Error during graceful shutdown'
    );

    process.exit(1);
  }
}

// Shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Force exit after 10 seconds
process.on('SIGINT', () => {
  setTimeout(() => {
    logger.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
});

process.on('SIGTERM', () => {
  setTimeout(() => {
    logger.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
});

// ───────────────────────────────────────────────────────────
// Safety Net
// ───────────────────────────────────────────────────────────

process.on('unhandledRejection', (reason) => {
  logger.error(
    { reason },
    'Unhandled Promise Rejection'
  );

  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(
    { error },
    'Uncaught Exception'
  );

  process.exit(1);
});

startServer();
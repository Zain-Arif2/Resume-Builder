import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  transport:
    env.nodeEnv !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
        }
      : undefined,
  base: { env: env.nodeEnv },
});

export const httpLogger = logger.child({ scope: 'http' });
export const authLogger = logger.child({ scope: 'auth' });
export const dbLogger = logger.child({ scope: 'db' });
export const aiLogger = logger.child({ scope: 'ai' });
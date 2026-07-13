import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

validateEnv();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiVersion: process.env.API_VERSION || 'v1',

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cookie: {
    domain: process.env.COOKIE_DOMAIN || 'localhost',
    secure: process.env.COOKIE_SECURE === 'true',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  resend: {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || 'ResumeAI <onboarding@resend.dev>',
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'openrouter',
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      model: process.env.OPENROUTER_MODEL || 'openrouter/free',
    },
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 1000,
  },
};

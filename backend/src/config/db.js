import mongoose from 'mongoose';
import { env } from './env.js';
import { dbLogger } from './logger.js';

export async function connectDB() {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    dbLogger.info('✅ MongoDB Atlas connected successfully');

    mongoose.connection.on('error', (err) => {
      dbLogger.error({ err }, 'MongoDB connection error');
    });

    mongoose.connection.on('disconnected', () => {
      dbLogger.warn('MongoDB disconnected');
    });
  } catch (error) {
    dbLogger.error({ error }, '❌ Failed to connect to MongoDB');
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
  dbLogger.info('MongoDB connection closed');
}
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, false);
  }

  const { statusCode, message, isOperational, details } = error;

  if (!isOperational) {
    logger.error({ err, path: req.originalUrl, method: req.method }, 'Unhandled/Programmer Error');
  } else {
    logger.warn({ statusCode, message, path: req.originalUrl }, 'Operational Error');
  }

  res.status(statusCode || 500).json({
    success: false,
    message: isOperational ? message : 'Internal Server Error',
    ...(details && { details }),
    ...(env.nodeEnv === 'development' && !isOperational && { stack: err.stack }),
  });
}

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
}
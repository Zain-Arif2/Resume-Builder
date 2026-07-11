export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(400, message, true, details);
  }
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, true);
  }
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, true);
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, true);
  }
  static conflict(message = 'Conflict') {
    return new ApiError(409, message, true);
  }
  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message, true);
  }
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message, false);
  }
}
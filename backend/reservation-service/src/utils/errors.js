class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

class UnprocessableError extends AppError {
  constructor(message = 'Unprocessable entity') {
    super(message, 422);
  }
}

module.exports = { AppError, NotFoundError, ConflictError, UnprocessableError };

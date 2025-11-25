class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message || 'Bad request', 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(message || 'Forbidden', 403);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not found', 404);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};
